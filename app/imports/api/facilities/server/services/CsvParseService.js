import Facilities from "/imports/api/facilities/collection";
import stateEnum from "/imports/api/accounts/enums/states";
import Accounts from "/imports/api/accounts/collection";
import { Substates } from "/imports/api/accounts/enums/substates";
import RulesEnum from "/imports/api/facilities/enums/importingRules";
import moment from "moment";

export default class CsvParseService {
  //Filtering existent accounts and new Accounts
  static filterAccounts(accounts) {
    let oldAccounts = [];
    let newAccounts = [];

    accounts.map(account => {
      if (Accounts.findOne({ acctNum: account.acctNum })) {
        oldAccounts.push(account);
      } else {
        account.state = stateEnum.ARCHIVED;
        account.substate = Substates.SELF_RETURNED;
        newAccounts.push(account);
      }
    });
    return [oldAccounts, newAccounts];
  }

  static convertToType(rule, value) {
    const { types } = RulesEnum;
    if (types.dates.includes(rule)) {
      const parsed = moment(value, "MM/DD/YYYY", true);
      return parsed.isValid() ? parsed.toDate() : "broken date!!!";
    } else if (types.numbers.includes(rule)) {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? "broken number!!!" : parsed;
    } else {
      //string
      return value;
    }
  }

  //Create a single account
  static createAccount(data, importRules, isPlacement, facilityId, rules) {
    let account = {};
    account.facilityId = facilityId;
    for (let key in importRules) {
      //Get the normal fields
      if (key !== "insurances") {
        let value;
        if (rules.newImportRules) {
          value = CsvParseService.convertToType(
            key,
            data[rules.newImportRules[key] - 1]
          );
        } else {
          value = CsvParseService.convertToType(
            key,
            data[importRules[key] - 1]
          );
        }
        account[key] = value;
      } else {
        //Get the insurance fields
        account[key] = [];
        for (let index in importRules[key]) {
          let insuranceFields = importRules[key][index];
          if (rules.newImportRules) {
            insuranceFields = rules.newImportRules[key][index];
          }
          account[key].push({
            insName: CsvParseService.convertToType(
              "insName",
              data[insuranceFields.insName - 1]
            ),
            insCode: CsvParseService.convertToType(
              "insCode",
              data[insuranceFields.insCode - 1]
            ),
            insBal: CsvParseService.convertToType(
              "insBal",
              data[insuranceFields.insBal - 1]
            )
          });
        }
      }
    }
    if (rules.metaRules) {
      account.metaData = {};
      for (let key in rules.metaRules) {
        let metaValue = CsvParseService.convertToType(
          key,
          data[rules.metaRules[key] - 1]
        );
        account.metaData[key] = metaValue;
      }
    }
    return account;
  }

  //Get import rules
  static getImportRules(_id, rules) {
    const facility = Facilities.findOne({ _id });
    return facility[rules];
  }

  static isInsuranceField(importingRules, field) {
    const { insurances, newInsBal } = importingRules;
    if (insurances) {
      for (let i in insurances) {
        if (
          [
            insurances[i].insBal,
            insurances[i].insCode,
            insurances[i].insName
          ].includes(field)
        ) {
          return true;
        }
      }
    }
    if (newInsBal) {
      for (let i in newInsBal) {
        if (newInsBal[i].insBal === field) {
          return true;
        }
      }
    }
    return false;
  }

  static convertImportingRules(importRules, header) {
    //Trim spaces from Header to avoid crashes and get metafields
    let metaRules = {};

    for (let index in header) {
      header[index] = header[index].trim();
      //Ignore the importing rules of insurances
      if (
        !Object.values(importRules).includes(header[index]) &&
        !CsvParseService.isInsuranceField(importRules, header[index])
      ) {
        metaRules[header[index]] = header.indexOf(header[index]) + 1;
      }
    }

    let newImportRules = {};
    delete importRules.hasHeader;
    for (let rule in importRules) {
      if (rule !== "insurances" && rule !== "newInsBal") {
        newImportRules[rule] = header.indexOf(importRules[rule].trim()) + 1;
      } else if (rule === "insurances") {
        newImportRules[rule] = [];
        for (let index in importRules[rule]) {
          newImportRules[rule].push({
            insName:
              header.indexOf(importRules[rule][index].insName.trim()) + 1,
            insCode:
              header.indexOf(importRules[rule][index].insCode.trim()) + 1,
            insBal: header.indexOf(importRules[rule][index].insBal.trim()) + 1
          });
        }
      } else if (rule === "newInsBal") {
        newImportRules[rule] = [];
        for (let index in importRules[rule]) {
          newImportRules[rule].push({
            insBal: header.indexOf(importRules[rule][index].insBal.trim()) + 1
          });
        }
      }
    }
    return { newImportRules, metaRules };
  }
}
