export default class UserService {
  static getActionsQueryParams(userId) {
    const params = {
      filters: { userId, type: { $nin: ["file", "revert"] } },
      actionsFilter: {},
      userFilter: {}
    };

    const type = FlowRouter.getQueryParam("type");

    if (type) {
      _.extend(params.filters, {
        $and: [{ type: { $nin: ["file", "revert"] } }, { type }]
      });
    }
    return params;
  }
}
