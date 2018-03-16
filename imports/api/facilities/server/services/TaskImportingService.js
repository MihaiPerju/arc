import CsvParseService from './CsvParseService';
import Accounts from '/imports/api/tasks/collection';
import Facilities from "../../collection";
import moment from "moment/moment";
import RulesEnum from "../../enums/importingRules";
import Tasks from "../../../tasks/collection";
import stateEnum from "../../../tasks/enums/states";
import {Substates} from "../../../tasks/enums/substates";

export default class TaskService {
    //For placement file
    static upload(results, rules, {fileId, facilityId}) {

        const {labels, importRules} = this.standardize(results, rules);

        const clientId = this.getClientIdByFacilityId(facilityId);

        const accounts = this.convertToAccounts(results, importRules, labels);
        const existentAccounts = Accounts.find({facilityId}).fetch();

        //Find account numbers of all created accounts and existent accounts
        const currAcctIds = this.getAcctNumbers(accounts);
        const existentAcctIds = this.getAcctNumbers(existentAccounts);


        //Find account numbers of all old accounts that need to be updated and update
        const toUpdateAccountIds = this.getCommonElements(currAcctIds, existentAcctIds);
        _.map(toUpdateAccountIds, (toUpdateAccountId) => {
            const toUpdateAccount = this.getAccount(accounts, toUpdateAccountId);

            //Backup the old accounts that need to be modified

            Accounts.update({acctNum: toUpdateAccount.acctNum}, {
                    $set: toUpdateAccount
                }
            );
        });

        //Find account numbers of all old accounts that need to be archived and archive
        const oldAccountIds = this.getDifferentElements(existentAcctIds, toUpdateAccountIds);
        _.map(oldAccountIds, (oldAccountId) => {
            Accounts.update({acctNum: oldAccountId}, {
                    $set: {
                        state: stateEnum.ARCHIVED,
                        substate: Substates.SELF_RETURNED
                    }
                }
            );
        });

        //Find account numbers of all new accounts that need to be inserted and insert
        const newAccountIds = this.getDifferentElements(currAcctIds, existentAcctIds);
        _.map(newAccountIds, (newAccountId) => {
            const newAccount = this.getAccount(accounts, newAccountId);
            Object.assign(newAccount, {facilityId, clientId, fileId});
            Accounts.insert(newAccount);
        });
    }

    static getAccount(accounts, acctNum) {
        return _.find(accounts, function (account) {
            return account.acctNum === acctNum;
        });
    }

    static getCommonElements(arr1, arr2) {
        return _.filter(arr1, function (id) {
            return arr2.indexOf(id) > -1;
        });
    }

    static getDifferentElements(arr1, arr2) {
        return _.filter(arr1, function (id) {
            return arr2.indexOf(id) === -1;
        });
    }

    static getAcctNumbers(accounts) {
        return _.map(accounts, (account) => {
            return account.acctNum;
        })
    }

    static standardize(results, rules) {
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
        return {labels, importRules};
    }

    static convertToAccounts(results, importRules, labels) {
        const accounts = [];

        for (let i = 0; i < results.length - 1; i++) {
            let account = this.createAccount(results[i], importRules, labels);
            accounts.push(account);
        }

        return accounts;
    }

    static createAccount(data, rules, labels) {
        let importRules = {...rules};
        let account = {};
        let mainFields = [];

        //Extract insurances first
        account.insurances = [];
        importRules.insurances.map(({insName, insCode, insBal}) => {
            //Mark indexes as used
            mainFields.push(insBal - 1, insCode - 1, insName - 1);
            //Get insurances
            account.insurances.push({
                insName: this.convertToType('insName', data[insName - 1]),
                insCode: this.convertToType('insCode', data[insCode - 1]),
                insBal: this.convertToType('insBal', data[insBal - 1])
            });
        });

        delete importRules.insurances;

        for (rule in importRules) {
            mainFields.push(importRules[rule] - 1);
            let value = this.convertToType(rule, data[importRules[rule] - 1]);
            account[rule] = value;
        }

        //Getting meta fields
        let metaData = {};
        let count = 1;
        data.map((value, index) => {
            if (!mainFields.includes(index)) {
                //Set label
                let label = "Column#" + (count++);
                if (labels) {
                    label = labels[index];
                }
                //Set value
                metaData[label] = value;
            }
        });
        Object.assign(account, {metaData});

        //Account is ready: main fields + insurances + meta
        return account;
    }

    static convertToType(rule, value) {
        const {types} = RulesEnum;
        if (types.dates.includes(rule)) {
            const parsed = moment(value, "MM/DD/YYYY", true);
            return parsed.isValid() ? parsed.toDate() : 'broken date!!!';
        } else if (types.numbers.includes(rule)) {
            const parsed = parseInt(value, 10);
            return isNaN(parsed) ? 'broken number!!!' : parsed
        }
        else {
            return value;
        }
    }

    static convertImportRules(rules, header) {
        let newRules = {};

        //Removing unnecessary rules
        delete rules.hasHeader;

        //Trim spaces for errors
        header = header.map(x => x.trim());

        //Getting first rules in numberFormat
        for (rule in rules) {
            newRules[rule] = header.indexOf(rules[rule]) + 1;
        }

        //Getting insurance rules in numberFormat
        newRules.insurances = [];
        for (insurance of rules.insurances) {
            let insuranceRule = {};
            for (rule in insurance) {
                insuranceRule[rule] = header.indexOf(insurance[rule]) + 1;
            }
            newRules.insurances.push(insuranceRule);
        }

        return newRules;
    }

    //For inventory file
    static update(results, rules, facilityId) {
        const {labels, importRules} = this.standardize(results, rules);

        const accounts = this.convertToAccounts(results, importRules, labels);
        const clientId = this.getClientIdByFacilityId(facilityId);

        const {oldAccounts, newAccounts} = this.filterAccounts(accounts);

        //Creating new accounts with 'archived' state
        newAccounts.map((account) => {
            Object.assign(account, {facilityId, clientId});
            Accounts.insert(account);
        });

        //Updating old accounts
        oldAccounts.map((account) => {
            const {acctNum} = account;
            Accounts.update({acctNum, facilityId}, {
                $set: account
            });
        });
    }

    static filterAccounts(accounts) {
        let oldAccounts = [];
        let newAccounts = [];

        accounts.map((account) => {
            if (Accounts.findOne({acctNum: account.acctNum})) {
                oldAccounts.push(account);
            } else {
                newAccounts.push(account);
            }
        });
        return {oldAccounts, newAccounts};
    }

    // Get client id by facility
    static getClientIdByFacilityId(facilityId) {
        return Facilities.findOne(facilityId).clientId;
    }
}