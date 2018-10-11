import Accounts from "/imports/api/accounts/collection";
import Facilities from "../../collection";
import moment from "moment/moment";
import RulesEnum from "../../enums/importingRules";
import stateEnum from "../../../accounts/enums/states";
import Backup from "/imports/api/backup/collection";
import ActionService from "../../../accounts/server/services/ActionService";
import FileService from "/imports/api/files/server/services/FileService";
import UploadStatuses from "/imports/api/files/enums/statuses";
import Files from "/imports/api/files/collection";
import Settings from "/imports/api/settings/collection.js";
import fs from "fs";
import FoldersEnum from "/imports/api/business";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

export default class AccountService {
  //For placement file
  static upload(results, rules, { fileId, facilityId }) {
    //Get the root directory
    const { root } = SettingsService.getSettings(settings.ROOT);

    //Update the file headers;
    const { header } = Files.findOne({
      _id: fileId
    });
    if (!header) {
      Files.update({ _id: fileId }, { $set: { header: results[0] } });
    } else {
      results[0] = header;
    }
    const { labels, importRules } = this.standardize(results, rules);

    const clientId = this.getClientIdByFacilityId(facilityId);

    const { accounts, corruptRows } = this.convertToAccounts(
      results,
      importRules,
      labels
    );

    //If there are no accounts or we have broken ones, file is not valid and nothing should take effect
    if (!accounts.length || corruptRows.length) {
      FileService.update(fileId, { corruptRows, status: UploadStatuses.FAIL });
      return;
    }

    //Other case - file upload was a success
    FileService.update(fileId, { status: UploadStatuses.SUCCESS });

    const existentAccounts = Accounts.find({ facilityId }).fetch();

    //Find account numbers of all created accounts and existent accounts
    const currAcctIds = this.getAcctNumbers(accounts);
    const existentAcctIds = this.getAcctNumbers(existentAccounts);

    //Find account numbers of all old accounts that need to be updated and update
    const toUpdateAccountIds = this.getCommonElements(
      currAcctIds,
      existentAcctIds
    );

    //Backup accounts
    let accountsToBackup = Accounts.find({
      acctNum: { $in: toUpdateAccountIds }
    }).fetch();
    this.backupAccounts(accountsToBackup);

    _.map(toUpdateAccountIds, toUpdateAccountId => {
      const toUpdateAccount = this.getAccount(accounts, toUpdateAccountId);
      Object.assign(toUpdateAccount, { fileId });

      const { invoiceNo } =
        Accounts.find({
          acctNum: toUpdateAccountId,
          facilityId
        }).fetch()[0] || {};

      if (toUpdateAccount.invoiceNo) {
        toUpdateAccount.invoiceNo = _.union(
          invoiceNo,
          toUpdateAccount.invoiceNo
        );
      } else {
        toUpdateAccount.invoiceNo = [];
      }

      Accounts.update(
        { acctNum: toUpdateAccountId, facilityId },
        { $set: toUpdateAccount }
      );
    });

    //Find account numbers of all old accounts that need to be archived and archive
    const oldAccountIds = this.getDifferentElements(
      existentAcctIds,
      toUpdateAccountIds
    );

    //Select only unarchived accounts and store this in backup
    accountsToBackup = Accounts.find({
      acctNum: { $in: oldAccountIds },
      state: { $ne: stateEnum.ARCHIVED },
      facilityId
    }).fetch();

    this.backupAccounts(accountsToBackup);

    //Apply system action
    ActionService.archive(oldAccountIds, facilityId, fileId);

    //Find account numbers of all new accounts that need to be inserted and insert
    const newAccountIds = this.getDifferentElements(
      currAcctIds,
      existentAcctIds
    );

    _.map(newAccountIds, newAccountId => {
      const newAccount = this.getAccount(accounts, newAccountId);
      Object.assign(newAccount, { facilityId, clientId, fileId });
      let accountId = Accounts.insert(newAccount);

      //Create a directory for every account to store attachments
      this.createAccountDirectory(accountId, root);
    });
  }

  static createAccountDirectory(accountId, root) {
    fs.mkdirSync(root + FoldersEnum.ACCOUNTS_FOLDER + accountId);
  }

  static backupAccounts(accounts) {
    for (let account of accounts) {
      delete account._id;
    }

    if (accounts.length) {
      const rawBackup = Backup.rawCollection();
      rawBackup.insert(accounts);
    }
  }

  static getAccount(accounts, acctNum) {
    return _.find(accounts, function(account) {
      return account.acctNum === acctNum;
    });
  }

  static getCommonElements(arr1, arr2) {
    return _.filter(arr1, function(id) {
      return arr2.indexOf(id) > -1;
    });
  }

  static getDifferentElements(arr1, arr2) {
    return _.filter(arr1, function(id) {
      return arr2.indexOf(id) === -1;
    });
  }

  static getAcctNumbers(accounts) {
    return _.map(accounts, account => {
      return account.acctNum;
    });
  }

  static standardize(results, rules) {
    //Convert all the rules to lower case to not be case-sensitive
    const { types } = RulesEnum;

    for (let rule in rules) {
      if (rule !== "insurances" && rule !== "hasHeader") {
        if (types.others.includes(rule)) {
          rules[rule] = rules[rule].toString();
        }
        rules[rule] = rules[rule].toLowerCase();
      }
    }
    for (let insurance of rules.insurances) {
      for (let rule in insurance) {
        insurance[rule] = insurance[rule].toLowerCase();
      }
    }

    for (let rule in results[0]) {
      results[0][rule] = results[0][rule].toString().toLowerCase();
    }

    //If importing rules are with header, convert them.
    let importRules = rules;
    let labels;
    if (rules.hasHeader) {
      importRules = this.convertImportRules(rules, results[0]);
      //Cutting first line, but keeping labels for metafields
      labels = results[0];
      results.splice(0, 1);
    }
    delete importRules.hasHeader;
    return { labels, importRules };
  }

  static convertToAccounts(results, importRules, labels) {
    let accounts = [];
    let corruptRows = [];

    for (let i = 0; i < results.length - 1; i++) {
      let account = this.createAccount(results[i], importRules, labels);
      if (!account) {
        corruptRows.push(i + 1);
      } else {
        accounts.push(account);
      }
    }

    return { accounts, corruptRows };
  }

  static createAccount(data, rules, labels) {
    let importRules = { ...rules };
    let account = {};
    let mainFields = [];

    let uploadErrors = {
      dates: 0,
      numbers: 0
    };

    //Extract insurances first
    account.insurances = [];
    importRules.insurances.map(
      ({
        insName,
        insCode,
        insBal,
        address1,
        address2,
        city,
        state,
        zip,
        policy,
        phone
      }) => {
        //Mark indexes as used
        mainFields.push(
          insBal - 1,
          insCode - 1,
          insName - 1,
          address1 - 1,
          address2 - 1,
          city - 1,
          state - 1,
          zip - 1,
          policy - 1,
          phone - 1
        );

        account.insurances.push({
          insName: this.convertToType(
            "insName",
            data[insName - 1],
            uploadErrors
          ),
          insCode: this.convertToType(
            "insCode",
            data[insCode - 1],
            uploadErrors
          ),
          insBal: this.convertToType("insBal", data[insBal - 1], uploadErrors),
          address1: this.convertToType(
            "address1",
            data[address1 - 1],
            uploadErrors
          ),
          address2: this.convertToType(
            "address2",
            data[address2 - 1],
            uploadErrors
          ),
          city: this.convertToType("city", data[city - 1], uploadErrors),
          state: this.convertToType("state", data[state - 1], uploadErrors),
          zip: this.convertToType("zip", data[zip - 1], uploadErrors),
          policy: this.convertToType("policy", data[policy - 1], uploadErrors),
          phone: this.convertToType("phone", data[phone - 1], uploadErrors)
        });
      }
    );

    delete importRules.insurances;

    for (let rule in importRules) {
      mainFields.push(importRules[rule] - 1);
      let value = this.convertToType(
        rule,
        data[importRules[rule] - 1],
        uploadErrors
      );
      account[rule] = value;
    }

    //Getting meta fields
    let metaData = {};
    let count = 1;
    data.map((value, index) => {
      if (!mainFields.includes(index)) {
        //Set label
        let label = "Column#" + count++;
        if (labels) {
          label = labels[index];
        }
        //Set value
        metaData[label] = value;
      }
    });
    Object.assign(account, { metaData });
    if (uploadErrors.numbers || uploadErrors.dates) {
      return null;
    }
    //Account is ready: main fields + insurances + meta
    return account;
  }

  static convertToType(rule, value, uploadErrors) {
    const { types } = RulesEnum;
    if (types.dates.includes(rule)) {
      const date = new Date(value);
      const dateString =
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "/" +
        ("0" + date.getDate()).slice(-2) +
        "/" +
        date.getFullYear();
      const parsed = moment(dateString, "MM/DD/YYYY", true);
      // If the date isn't valid add an exception
      if (parsed.isValid() === false) {
        uploadErrors.dates++;
      }
      return parsed.isValid() ? parsed.toDate() : null;
    } else if (types.numbers.includes(rule)) {
      const parsed = parseInt(value, 10);

      //If the number isn't valid add an exception
      if (isNaN(parsed)) {
        uploadErrors.numbers++;
      }
      return isNaN(parsed) ? null : parsed;
    } else if (types.others.includes(rule)) {
      const date = new Date(value);
      const dateString =
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "/" +
        ("0" + date.getDate()).slice(-2) +
        "/" +
        date.getFullYear();
      const parsed = moment(dateString, "MM/DD/YYYY", true);
      if (parsed.isValid()) {
        return parsed.toDate();
      } else if (!isNaN(parseInt(value, 10))) {
        const parsed = parseInt(value, 10);
        return parsed;
      }
      return value;
    }
    if (rule === "ptName") {
      return value ? value.replace(/,/g, ", ") : null;
    }
    return value;
  }

  static convertImportRules(rules, header) {
    let newRules = {};

    //Removing unnecessary rules
    delete rules.hasHeader;

    //Trim spaces for errors
    header = header.map(x => x.trim());

    //Getting first rules in numberFormat
    for (let rule in rules) {
      newRules[rule] = header.indexOf(rules[rule]) + 1;
    }

    //Getting insurance rules in numberFormat
    newRules.insurances = [];
    for (let insurance of rules.insurances) {
      let insuranceRule = {};
      for (let rule in insurance) {
        insuranceRule[rule] = header.indexOf(insurance[rule]) + 1;
      }
      newRules.insurances.push(insuranceRule);
    }

    return newRules;
  }

  //For inventory file
  static update(results, rules, { fileId, facilityId }) {
    //Update the file headers;
    const { header } = Files.findOne({
      _id: fileId
    });
    if (!header) {
      Files.update({ _id: fileId }, { $set: { header: results[0] } });
    } else {
      results[0] = header;
    }

    const { labels, importRules } = this.standardize(results, rules);

    const { accounts, corruptRows } = this.convertToAccounts(
      results,
      importRules,
      labels
    );

    //If there are no accounts, file is not valid and nothing should take effect
    if (!accounts.length) {
      FileService.update(fileId, { status: UploadStatuses.FAIL });
      return;
    } else {
      FileService.update(fileId, { status: UploadStatuses.SUCCESS });
      FileService.update(fileId, { corruptRows });
    }

    const clientId = this.getClientIdByFacilityId(facilityId);

    const { oldAccountIds, newAccountIds } = this.filterAccounts(accounts);

    //Creating new accounts
    _.map(newAccountIds, accountId => {
      const newAccount = this.getAccount(accounts, accountId);
      Object.assign(newAccount, { facilityId, fileId, clientId });

      Accounts.insert(newAccount);
    });

    //Backup old accounts
    let accountsToBackup = Accounts.find({
      acctNum: { $in: oldAccountIds }
    }).fetch();
    this.backupAccounts(accountsToBackup);

    //Updating old accounts
    _.map(oldAccountIds, accountId => {
      const toUpdateAccount = this.getAccount(accounts, accountId);
      Object.assign(toUpdateAccount, { fileId });

      const { invoiceNo } =
        Accounts.find({
          acctNum: accountId,
          facilityId
        }).fetch()[0] || {};

      if (toUpdateAccount.invoiceNo) {
        toUpdateAccount.invoiceNo = _.union(
          invoiceNo,
          toUpdateAccount.invoiceNo
        );
      } else {
        toUpdateAccount.invoiceNo = [];
      }

      Accounts.update(
        { acctNum: accountId, facilityId },
        {
          $set: toUpdateAccount
        }
      );
    });
  }

  static filterAccounts(accounts) {
    let oldAccountIds = [];
    let newAccountIds = [];

    accounts.map(account => {
      const { acctNum } = account;
      if (Accounts.findOne({ acctNum })) {
        oldAccountIds.push(acctNum);
      } else {
        newAccountIds.push(acctNum);
      }
    });
    return { oldAccountIds, newAccountIds };
  }

  // Get client id by facility
  static getClientIdByFacilityId(facilityId) {
    return Facilities.findOne(facilityId).clientId;
  }
}
