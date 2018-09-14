import Rules from "../collection";

export default Rules.createQuery("listRules", {
  $filter({ filters, options, params }) {
    _.extend(filters, params.filters);
    _.extend(options, params.options);
  },
  $paginate: true,
  name: 1,
  description: 1,
  clientId: 1,
  facilityId: 1,
  rule: 1,
  priority: 1,
  isBreakingLoop: 1,
  triggerType: 1,
  actionId: 1,
  assigneeId: 1,
  workQueueId: 1,
  editField: 1,
  editValue: 1
});
