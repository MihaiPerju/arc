import Facilities from '/imports/api/facilities/collection';
import stateEnum from '/imports/api/tasks/enums/states';
import Tasks from '/imports/api/tasks/collection';
import {Substates} from '/imports/api/tasks/enums/substates';

export default class CsvParseService {

    //Converting to tasks
    static convertToTasks(results, importRules, isPlacement, facilityId) {
        const header = results[0];
        results.splice(0, 1);
        if (importRules.hasHeader) {
            importRules = CsvParseService.convertImportingRules(importRules, header);
        }

        const tasks = [];
        for (let i = 0; i < results.length - 1; i++) {
            const newTask = CsvParseService.createTask(results[i], importRules, isPlacement, facilityId);
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


    //Create a single task
    static createTask(data, importRules, isPlacement, facilityId) {

        let task = {};
        task.facilityId = facilityId;
        for (key in importRules) {
            if (key !== 'hasHeader') {
                task[key] = data[importRules[key] - 1];
            }
        }
        return task;
    }

//Get import rules
    static getImportRules(id) {
        const facility = Facilities.findOne({_id: id}, {
            fields: {
                importRules: 1,
            }
        });
        return facility.importRules;
    }

    static convertImportingRules(importRules, header) {
        //Trim spaces from Header to avoid crashes
        for (index in header) {
            header[index] = header[index].trim();
        }

        let newImportRules = {};
        delete importRules.hasHeader;
        for (rule in importRules) {
            newImportRules[rule] = header.indexOf(importRules[rule].trim()) + 1;
        }
        return (newImportRules);
    }
}