import Facilities from '/imports/api/facilities/collection';

export default class CsvParseService {

    static convertToTasks(results, importRules) {
        const startIndex = importRules.hasHeader ? 1 : 0;

        const tasks = [];

        for (let i = startIndex; i < results.length - 1; i++) {
            const newTask = CsvParseService.createTask(results[i], importRules);
            tasks.push(newTask);
        }

        Meteor.call('tasks.create', tasks);
    }

    static createTask(data, importRules) {
        let task = {};
        for (key in importRules) {
            if (key !== 'hasHeader') {
                task[key] = data[importRules[key] - 1];
            }
        }
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