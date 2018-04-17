import Facilities from '/imports/api/facilities/collection';
import stateEnum from '/imports/api/tasks/enums/states';
import Tasks from '/imports/api/tasks/collection';
import {Substates} from '/imports/api/tasks/enums/substates';
import RulesEnum from '/imports/api/facilities/enums/importingRules';
import moment from 'moment';

export default class CsvParseService {

    //Filtering existent tasks and new Tasks
    static filterTasks(tasks) {
        let oldTasks = [];
        let newTasks = [];

        tasks.map((task) => {
            if (Tasks.findOne({acctNum: task.acctNum})) {
                oldTasks.push(task);
            } else {
                task.state = stateEnum.ARCHIVED;
                task.substate = Substates.SELF_RETURNED;
                newTasks.push(task);
            }
        });
        return [oldTasks, newTasks];
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
            //string
            return value;
        }
    }

    //Create a single task
    static createTask(data, importRules, isPlacement, facilityId, rules) {
        let task = {};
        task.facilityId = facilityId;
        for (key in importRules) {
            //Get the normal fields
            if (key !== 'insurances') {
                let value;
                if (rules.newImportRules) {
                    value = CsvParseService.convertToType(key, data[rules.newImportRules[key] - 1]);
                } else {
                    value = CsvParseService.convertToType(key, data[importRules[key] - 1]);
                }
                task[key] = value;
            } else {
                //Get the insurance fields
                task[key] = [];
                for (index in importRules[key]) {
                    let insuranceFields = importRules[key][index];
                    if (rules.newImportRules) {
                        insuranceFields = rules.newImportRules[key][index];
                    }
                    task[key].push({
                        insName: CsvParseService.convertToType('insName', data[insuranceFields.insName - 1]),
                        insCode: CsvParseService.convertToType('insCode', data[insuranceFields.insCode - 1]),
                        insBal: CsvParseService.convertToType('insBal', data[insuranceFields.insBal - 1])
                    })
                }
            }
        }
        if (rules.metaRules) {
            task.metaData = {};
            for (key in rules.metaRules) {
                let metaValue = CsvParseService.convertToType(key, data[rules.metaRules[key] - 1]);
                task.metaData[key] = metaValue;
            }
        }
        return task;
    }

    //Get import rules
    static getImportRules(_id, rules) {
        const facility = Facilities.findOne({_id});
        return facility[rules];
    }

    static isInsuranceField(importingRules, field) {
        const {insurances, newInsBal} = importingRules;
        if (insurances) {
            for (i in insurances) {
                if ([insurances[i].insBal, insurances[i].insCode, insurances[i].insName].includes(field)) {
                    return true;
                }
            }
        }
        if (newInsBal) {
            for (i in newInsBal) {
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

        for (index in header) {
            header[index] = header[index].trim();
            //Ignore the importing rules of insurances
            if (!Object.values(importRules).includes(header[index]) && !CsvParseService.isInsuranceField(importRules, header[index])) {
                metaRules[header[index]] = header.indexOf(header[index]) + 1;
            }
        }

        let newImportRules = {};
        delete importRules.hasHeader;
        for (rule in importRules) {
            if (rule !== 'insurances' && rule !== 'newInsBal') {
                newImportRules[rule] = header.indexOf(importRules[rule].trim()) + 1;
            }
            else if (rule === 'insurances') {
                newImportRules[rule] = [];
                for (index in importRules[rule]) {
                    newImportRules[rule].push({
                        insName: header.indexOf(importRules[rule][index].insName.trim()) + 1,
                        insCode: header.indexOf(importRules[rule][index].insCode.trim()) + 1,
                        insBal: header.indexOf(importRules[rule][index].insBal.trim()) + 1
                    })
                }
            } else if (rule === 'newInsBal') {
                newImportRules[rule] = [];
                for (index in importRules[rule]) {
                    newImportRules[rule].push({
                        insBal: header.indexOf(importRules[rule][index].insBal.trim()) + 1
                    })
                }
            }
        }
        return ({newImportRules, metaRules});
    }
}