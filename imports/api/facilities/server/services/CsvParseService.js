import Facilities from '/imports/api/facilities/collection';
import stateEnum from '/imports/api/tasks/enums/states';
import Tasks from '/imports/api/tasks/collection';
import {Substates} from '/imports/api/tasks/enums/substates';
import RulesEnum from '/imports/api/facilities/enums/importingRules';
import moment from 'moment';

export default class CsvParseService {

    //Converting to tasks
    static convertToTasks(results, importRules, isPlacement, facilityId) {
        const tasks = [];
        let rules = {};
        if (importRules.hasHeader) {
            const header = results[0];
            results.splice(0, 1);
            rules = CsvParseService.convertImportingRules(importRules, header);
        }

        for (let i = 0; i < results.length - 1; i++) {
            const newTask = CsvParseService.createTask(results[i], importRules, isPlacement, facilityId, rules);
            tasks.push(newTask);
        }
        return tasks;
    }

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
            return value;
        }
    }

    //Create a single task
    static createTask(data, importRules, isPlacement, facilityId, rules) {
        let task = {};

        task.facilityId = facilityId;
        for (key in importRules) {
            let value;
            if (rules.newImportRules) {
                value = CsvParseService.convertToType(key, data[rules.newImportRules[key] - 1]);
            } else {
                value = CsvParseService.convertToType(key, data[importRules[key] - 1]);
            }
            task[key] = value;
        }
        if (rules.metaRules) {
            task.metaData = {};
            for (key in rules.metaRules) {
                metaValue = CsvParseService.convertToType(key, data[rules.metaRules[key] - 1]);
                task.metaData[key] = metaValue;
            }
        }
        return task;
    }

    //Get import rules
    static getImportRules(_id) {
        const {importRules} = Facilities.findOne({_id});
        return importRules;
    }

    static convertImportingRules(importRules, header) {
        //Trim spaces from Header to avoid crashes and get metafields
        let metaRules = {};
        for (index in header) {
            header[index] = header[index].trim();
            Object.values(importRules);
            if (!Object.values(importRules).includes(header[index])) {
                metaRules[header[index]] = header.indexOf(header[index]) + 1;
            }
        }

        let newImportRules = {};
        delete importRules.hasHeader;
        for (rule in importRules) {
            newImportRules[rule] = header.indexOf(importRules[rule].trim()) + 1;
        }
        return ({newImportRules, metaRules});
    }
}