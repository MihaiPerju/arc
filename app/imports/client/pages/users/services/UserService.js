export default class UserService {
  static getActionsQueryParams(userId) {
    const params = {
      filters: { userId },
      actionsFilter: {},
      userFilter: {}
    };

    const type = FlowRouter.getQueryParam("type");

    if (type) {
      _.extend(params.filters, {
        type
      });
    }
    return params;
  }
}
