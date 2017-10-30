import Facilities from '/imports/api/facilities/collection';
import stateEnum from '/imports/api/tasks/enums/states';
import Tasks from '/imports/api/tasks/collection';

export default class CsvParseService {

    static convertToTasks(results, importRules) {
        const startIndex = importRules.hasHeader ? 1 : 0;

        const tasks = [];
        for (let i = startIndex; i < results.length - 1; i++) {
            const newTask = CsvParseService.createTask(results[i], importRules);
            tasks.push(newTask);
        }

        return tasks;
    }

    static upload(results, importRules) {
        const tasks = CsvParseService.convertToTasks(results, importRules);
        Meteor.call('tasks.create', tasks);
    }

    static update(results, importRules) {
        const oldTasks = CsvParseService.convertToTasks(results, importRules);
        const newTasks = [];

        oldTasks.map((task) => {
            if (!Tasks.findOne({acctNum: task.acctNum})) {
                task.state = stateEnum.ARCHIVED;
                oldTasks.pop(task);
                newTasks.push(task);
            }
        });

        Meteor.call('tasks.create', newTasks);
        Meteor.call('tasks.update', oldTasks);
    }

    static createTask(data, importRules) {
        let task = {};
        for (key in importRules) {
            if (key !== 'hasHeader') {
                task[key] = data[importRules[key] - 1];
            }
        }
        task.state = stateEnum.ACTIVE;
        return task;
    }

    static getImportRules(id) {
        const facility = Facilities.findOne({_id: id}, {
            fields: {
                importRules: 1,
            }
        });
        return facility.importRules;
    }
}