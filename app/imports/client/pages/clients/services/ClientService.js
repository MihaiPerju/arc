import moment from "moment";
import actionTypesEnum from "/imports/api/accounts/enums/actionTypesEnum";

export default class ClientService {
  static getActionsQueryParams(clientId) {
    const params = {
      filters: { clientId },
      accountFilter: {},
      userFilter: {}
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
    const role = FlowRouter.getQueryParam("role");

    if (type) {
      _.extend(params.filters, {
        type
      });
    }

    if (substate) {
      _.extend(params.accountFilter, {
        substate
      });
    }

    if (weekToDate) {
      const firstDay = this.getWeekToDate();
      const filter = {
        createdAt: { $gte: new Date(moment(firstDay).startOf("day")) }
      };
      _.extend(params.filters, filter);
    }

    if (monthToDate) {
      const firstDay = this.getMonthToDate();
      const filter = {
        createdAt: { $gte: new Date(moment(firstDay).startOf("day")) }
      };
      _.extend(params.filters, filter);
    }

    if (yearToDate) {
      const year = new Date().getFullYear();
      const firstDay = new Date(year, 0, 1);
      const filter = {
        createdAt: { $gte: new Date(moment(firstDay).startOf("day")) }
      };
      _.extend(params.filters, filter);
    }

    if (lastNDays) {
      const filter = {
        createdAt: {
          $gte: new Date(
            moment(moment().subtract(+lastNDays, "days")).startOf("day")
          )
        }
      };
      _.extend(params.filters, filter);
    }

    if (lastNMonths) {
      const filter = {
        createdAt: {
          $gte: new Date(
            moment(moment().subtract(+lastNMonths, "months")).startOf("day")
          )
        }
      };
      _.extend(params.filters, filter);
    }

    if (yesterday) {
      const filter = {
        createdAt: {
          $gte: new Date(moment(moment().subtract(1, "days")).startOf("day"))
        }
      };
      _.extend(params.filters, filter);
    }

    if (lastWeek) {
      const currentWeekDate = this.getWeekToDate();
      const filter = {
        createdAt: {
          $gte: new Date(
            moment(moment(currentWeekDate).subtract(7, "days")).startOf("day")
          )
        }
      };
      _.extend(params.filters, filter);
    }

    if (lastMonth) {
      const currentMonthDate = this.getMonthToDate();
      const filter = {
        createdAt: {
          $gte: new Date(
            moment(moment(currentMonthDate).subtract(1, "months")).startOf(
              "day"
            )
          )
        }
      };
      _.extend(params.filters, filter);
    }

    if (role) {
      _.extend(params.userFilter, {
        roles: { $in: [role] }
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

  static getFilterParams() {
    const queryParams = FlowRouter.current().queryParams;
    const model = {},
      state = {};

    if ("type" in queryParams) {
      model.type = queryParams.type;
    } else {
      model.type = actionTypesEnum.FILE;
      FlowRouter.setQueryParams({ type: actionTypesEnum.FILE });
    }

    if ("substate" in queryParams) {
      model.substate = queryParams.substate;
    }

    if ("role" in queryParams) {
      model.role = queryParams.role;
    }

    if ("last-n-days" in queryParams) {
      if (queryParams["last-n-days"] === 7) {
        state.lastSevenDays = true;
      } else {
        state.lastThirtyDays = true;
      }
    }

    if ("last-n-months" in queryParams) {
      state.lastTwelveMonths = true;
    }

    if ("weekToDate" in queryParams) {
      state.weekToDate = true;
    }

    if ("monthToDate" in queryParams) {
      state.monthToDate = true;
    }

    if ("yearToDate" in queryParams) {
      state.yearToDate = true;
    }

    if ("yesterday" in queryParams) {
      state.yesterday = true;
    }

    if ("lastWeek" in queryParams) {
      state.lastWeek = true;
    }

    if ("lastMonth" in queryParams) {
      state.lastMonth = true;
    }

    return { model, state };
  }
}
