import CsvParseService from './CsvParseService';
import Tasks from '/imports/api/tasks/collection';
import Facilities from "../../collection";

export default class TaskService {
    //For placement file
    static upload(results, rules, facilityId) {

        //If importing rules are with header, convert them.
        let importRules;
        if (rules.hasHeader) {
            importRules = this.convertImportRules(rules, results[0]);
            //Cutting first line
            results.splice(0, 1);
        }
        console.log(results);

        //Get client
        const clientId = this.getClientIdByFacilityId(facilityId);

        const accounts = this.convertToAccounts(results, importRules, rules);

        // Creating tasks
        // tasks.map((task) => {
        //     Tasks.insert(task);
        // });
    }

    static convertToAccounts(results, importRules, rules) {
        const accounts = [];

        for (let i = 0; i < results.length - 1; i++) {
            let account = this.createAccount(results[i], importRules, rules);

            accounts.push(account);
        }
        return accounts;
    }

    static createAccount(data, importRules, rules) {
        let account = {};
        console.log(importRules);
        for (index of importRules) {
            console.log(index);
            //Get the normal fields
            // if (key !== 'insurances') {
            //     let value;
            //     if (rules.newImportRules) {
            //         value = CsvParseService.convertToType(key, data[rules.newImportRules[key] - 1]);
            //     } else {
            //         value = CsvParseService.convertToType(key, data[importRules[key] - 1]);
            //     }
            //     task[key] = value;
            // } else {
            //     //Get the insurance fields
            //     task[key] = [];
            //     // console.log(importRules[key]);
            //     for (index in importRules[key]) {
            //         let insuranceFields = importRules[key][index];
            //         if (rules.newImportRules) {
            //             insuranceFields = rules.newImportRules[key][index];
            //         }
            //         // console.log(insuranceFields);
            //         task[key].push({
            //             insName: CsvParseService.convertToType('insName', data[insuranceFields.insName - 1]),
            //             insCode: CsvParseService.convertToType('insCode', data[insuranceFields.insCode - 1]),
            //             insBal: CsvParseService.convertToType('insBal', data[insuranceFields.insBal - 1])
            //         })
            //     }
            // }
        }
        // if (rules.metaRules) {
        //     task.metaData = {};
        //     for (key in rules.metaRules) {
        //         let metaValue = CsvParseService.convertToType(key, data[rules.metaRules[key] - 1]);
        //         task.metaData[key] = metaValue;
        //     }
        // }
        return account;
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
    static update(results, importRules, facilityId) {
        const tasks = CsvParseService.convertToTasks(results, importRules, false, facilityId);
        const [oldTasks, newTasks] = CsvParseService.filterTasks(tasks);

        //Creating new tasks with 'archived' state
        newTasks.map((task) => {
            Tasks.insert(task);
        });

        //Updating old tasks
        oldTasks.map((task) => {
            const {acctNum} = task;
            Tasks.update({acctNum}, {
                $set: task
            });
        });
    }

    /**
     * Get client id by facility
     * @param facilityId
     */
    static getClientIdByFacilityId(facilityId) {
        return Facilities.findOne(facilityId).clientId;
    }
}