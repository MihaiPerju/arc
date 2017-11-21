import Facilities from '/imports/api/facilities/collection';
import stateEnum from '/imports/api/tasks/enums/states';
import Tasks from '/imports/api/tasks/collection';
import {Substates} from '/imports/api/tasks/enums/substates';

export default class CsvParseService {

    //Converting to tasks
    static convertToTasks(results, importRules, isPlacement, facilityId) {

        const startIndex = importRules.hasHeader ? 1 : 0;

        const tasks = [];
        for (let i = startIndex; i < results.length - 1; i++) {
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
}