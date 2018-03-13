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
    static upload(results, rules, facilityId) {

        const {labels, importRules} = this.standardize(results, rules);

        const accounts = this.convertToAccounts(results, importRules, labels);
        const clientId = this.getClientIdByFacilityId(facilityId);

        // Creating accounts
        accounts.map((account) => {
            Object.assign(account, {facilityId, clientId});
            Accounts.insert(account);
        });
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
            Accounts.update({acctNum}, {
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
                account.state = stateEnum.ARCHIVED;
                account.substate = Substates.SELF_RETURNED;
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