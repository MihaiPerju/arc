export default class WorkQueueService {
    static createOptions(data) {
        let workQueues = [{label: "Unassigned"}];
        for (tag of data) {
            workQueues.push({value: tag._id, label: tag.name});
        }
        return workQueues;
    }
}