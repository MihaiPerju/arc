import Facilities from '/imports/api/facilities/collection';
import stateEnum from '/imports/api/tasks/enums/states';
import Tasks from '/imports/api/tasks/collection';

export default class CsvParseService {

    //MAIN Functions

    //For placement file
    static upload(results, importRules) {
        const tasks = CsvParseService.convertToTasks(results, importRules, true);

        //Creating tasks
        const RowTasks = Tasks.rawCollection();
        RowTasks.insert(tasks);
    }

    //For inventory file
    static update(results, importRules) {
        const tasks = CsvParseService.convertToTasks(results, importRules);
        const [oldTasks, newTasks] = CsvParseService.filterTasks(tasks);

        //Creating new tasks with 'archived' state
        const RowTasks = Tasks.rawCollection();
        RowTasks.insert(newTasks);

        //Updating old tasks
        oldTasks.map((task) => {
            const {acctNum} = task;
            Tasks.update({acctNum}, {
                $set: task
            });
        });
    }

    //Converting to tasks
    static convertToTasks(results, importRules, isPlacement) {
        const startIndex = importRules.hasHeader ? 1 : 0;

        const tasks = [];
        for (let i = startIndex; i < results.length - 1; i++) {
            const newTask = CsvParseService.createTask(results[i], importRules, isPlacement);
            tasks.push(newTask);
        }

        return tasks;
    }

    //HELPER Functions

    //Filtering existent tasks and new Tasks
    static filterTasks(tasks) {
        let oldTasks = [];
        let newTasks = [];

        tasks.map((task) => {
            if (Tasks.findOne({acctNum: task.acctNum})) {
                oldTasks.push(task);
            } else {
                task.state = stateEnum.ARCHIVED;
                newTasks.push(task);
            }
        });

        return [oldTasks, newTasks];
    }

    //Create a single task
    static createTask(data, importRules, isPlacement) {
        let task = {};
        for (key in importRules) {
            if (key !== 'hasHeader') {
                task[key] = data[importRules[key] - 1];
            }
        }
        if (isPlacement) {
            task.state = stateEnum.ACTIVE;
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