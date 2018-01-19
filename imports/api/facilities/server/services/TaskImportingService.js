import CsvParseService from './CsvParseService';
import Tasks from '/imports/api/tasks/collection';

export default class TaskService {
    //For placement file
    static upload(results, importRules, facilityId) {
        const tasks = CsvParseService.convertToTasks(results, importRules, true, facilityId);
        //Creating tasks
        tasks.map((task) => {
            Tasks.insert(task);
        });
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
}