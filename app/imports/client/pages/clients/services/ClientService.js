import moment from "moment";

export default class ClientService {
  static getActionsQueryParams(clientId) {
    const params = {
      filters: { clientId },
      actionsFilter: {}
    };

    const type = FlowRouter.getQueryParam("type");
    const substate = FlowRouter.getQueryParam("substate");
    const weekToDate = FlowRouter.getQueryParam("weekToDate");
    const monthToDate = FlowRouter.getQueryParam("monthToDate");
    const yearToDate = FlowRouter.getQueryParam("yearToDate");
    const lastNDays = FlowRouter.getQueryParam("last-n-days");
    const lastNMonths = FlowRouter.getQueryParam("last-n-months");
    const yesterday = FlowRouter.getQueryParam("yesterday");
    const lastWeek = FlowRouter.getQueryParam("lastWeek");
    const lastMonth = FlowRouter.getQueryParam("lastMonth");

    if (type) {
      _.extend(params.actionsFilter, {
        type
      });
    }

    if (substate) {
      _.extend(params.filters, {
        substate
      });
    }

    if (weekToDate) {
      const firstDay = this.getWeekToDate();
      _.extend(params.actionsFilter, {
        createdAt: { $gte: new Date(moment(firstDay).startOf("day")) }
      });
    }

    if (monthToDate) {
      const firstDay = this.getMonthToDate();
      _.extend(params.actionsFilter, {
        createdAt: { $gte: new Date(moment(firstDay).startOf("day")) }
      });
    }

    if (yearToDate) {
      const year = new Date().getFullYear();
      const firstDay = new Date(year, 0, 1);
      _.extend(params.actionsFilter, {
        createdAt: { $gte: new Date(moment(firstDay).startOf("day")) }
      });
    }

    if (lastNDays) {
      _.extend(params.actionsFilter, {
        createdAt: {
          $gte: new Date(
            moment(moment().subtract(+lastNDays, "days")).startOf("day")
          )
        }
      });
    }

    if (lastNMonths) {
      _.extend(params.actionsFilter, {
        createdAt: {
          $gte: new Date(
            moment(moment().subtract(+lastNMonths, "months")).startOf("day")
          )
        }
      });
    }

    if (yesterday) {
      _.extend(params.actionsFilter, {
        createdAt: {
          $gte: new Date(moment(moment().subtract(1, "days")).startOf("day"))
        }
      });
    }

    if (lastWeek) {
      const currentWeekDate = this.getWeekToDate();
      _.extend(params.actionsFilter, {
        createdAt: {
          $gte: new Date(
            moment(moment(currentWeekDate).subtract(7, "days")).startOf("day")
          )
        }
      });
    }

    if (lastMonth) {
      const currentMonthDate = this.getMonthToDate();
      _.extend(params.actionsFilter, {
        createdAt: {
          $gte: new Date(
            moment(moment(currentMonthDate).subtract(1, "months")).startOf("day")
          )
        }
      });
    }

    return params;
  }

  static getWeekToDate() {
    const date = new Date(),
      day = date.getDay();
    const firstDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + (day == 0 ? -6 : 1) - day
    );
    return firstDay;
  }

  static getMonthToDate() {
    const date = new Date(),
      year = date.getFullYear(),
      month = date.getMonth();

    return new Date(year, month, 1);
  }
}
