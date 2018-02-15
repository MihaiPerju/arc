export default class TaskService {
    static containsTask(arr, task) {
        for (i in arr) {
            const currTask = arr[i];
            if (JSON.stringify(currTask) == JSON.stringify(task)) {
                return true;
            }
        }
        return false;
    }
}