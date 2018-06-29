import JobQueue from "../collection";

export default JobQueue.createQuery("listJobQueues", {
  $filter({ filters, options, params }) {
    _.extend(filters, params.filters);
    _.extend(options, params.options);
  },
  $paginate: true,
  type: 1,
  reportId: 1,
  workerId: 1,
  timeStamp: 1,
  status: 1
});
