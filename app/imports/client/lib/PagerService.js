import moment from "moment";
import stateEnum from "/imports/api/accounts/enums/states";

export default class PagerService {
  static setQuery(query, { page, perPage, state, assign, filters }) {
    let params = this.getPagerOptions(page, perPage);

    if (state || state === "") {
      this.getAccountFilters(params, state, filters);
      this.getProperAccounts(params, assign);
    }
    // common method for filtering
    this.getFilters(params, filters);
    return query.clone(params);
  }

  static getAccountQueryParams() {
    const page = FlowRouter.getQueryParam("page");
    const assign = FlowRouter.getQueryParam("assign");
    const facilityId = FlowRouter.getQueryParam("facilityId");
    const clientId = FlowRouter.getQueryParam("clientId");
    const acctNum = FlowRouter.getQueryParam("acctNum");
    const facCode = FlowRouter.getQueryParam("facCode");
    const ptType = FlowRouter.getQueryParam("ptType");
    const acctBal = FlowRouter.getQueryParam("acctBal");
    const finClass = FlowRouter.getQueryParam("finClass");
    const substate = FlowRouter.getQueryParam("substate");
    const dischrgDate = FlowRouter.getQueryParam("dischrgDate");
    const fbDate = FlowRouter.getQueryParam("fbDate");
    let state = FlowRouter.current().params.state;

    if (stateEnum.ACTIVE.toLowerCase() === state && acctNum) {
      state = "";
    }

    const perPage = 13;

    return {
      filters: {
        facilityId,
        clientId,
        acctNum,
        facCode,
        ptType,
        acctBal,
        finClass,
        substate,
        dischrgDate,
        fbDate
      },
      page,
      perPage,
      state,
      assign
    };
  }

  static getProperAccounts(params, assign) {
    if (assign === "none") {
      _.extend(params.filters, {
        assigneeId: { $exists: true },
        workQueue: { $exists: true }
      });
    } else if (assign) {
      const filterArr = assign.split(",");
      if (_.contains(filterArr, "assigneeId")) {
        _.extend(params.filters, {
          $or: [
            { workQueue: { $in: filterArr } },
            {
              assigneeId: { $exists: true }
            }
          ]
        });
      } else {
        _.extend(params.filters, { workQueue: { $in: filterArr } });
      }
    }
  }

  static getAccountFilters(
    params,
    state,
    {
      acctNum,
      facilityId,
      clientId,
      facCode,
      ptType,
      acctBal,
      finClass,
      substate,
      dischrgDate,
      fbDate
    }
  ) {
    if (state === "unassigned") {
      _.extend(params, {
        filters: {
          assigneeId: null,
          workQueue: null,
          tickleDate: null,
          escalateReason: null
        }
      });
    } else if (state === "tickles") {
      _.extend(params, {
        filters: { tickleDate: { $exists: true }, escalateReason: null }
      });
    } else if (state === "escalated") {
      _.extend(params, {
        filters: { tickleDate: null, escalateReason: { $exists: true } }
      });
    } else if (state && state !== "all") {
      state = stateEnum[state.toUpperCase()];
      _.extend(params, {
        filters: { state, tickleDate: null, escalateReason: null }
      });
    } else {
      // state undefined
      _.extend(params, {
        filters: { state: { $exists: true } }
      });
    }

    //adding query options
    if (acctNum) {
      _.extend(params.filters, { acctNum: { $regex: acctNum, $options: "i" } });
    }
    if (facilityId) {
      _.extend(params.filters, { facilityId });
    }
    if (clientId) {
      _.extend(params.filters, { clientId });
    }
    if (facCode) {
      _.extend(params.filters, { facCode });
    }
    if (ptType) {
      _.extend(params.filters, { ptType });
    }
    if (acctBal) {
      _.extend(params.filters, { acctBal: +acctBal });
    }
    if (finClass) {
      _.extend(params.filters, { finClass });
    }
    if (substate) {
      _.extend(params.filters, { substate });
    }
    if (dischrgDate) {
      _.extend(params.filters, {
        dischrgDate: {
          $gte: new Date(moment(new Date(dischrgDate)).startOf("day")),
          $lt: new Date(
            moment(new Date(dischrgDate))
              .startOf("day")
              .add(1, "day")
          )
        }
      });
    }
    if (fbDate) {
      _.extend(params.filters, {
        fbDate: {
          $gte: new Date(moment(new Date(fbDate)).startOf("day")),
          $lt: new Date(
            moment(new Date(fbDate))
              .startOf("day")
              .add(1, "day")
          )
        }
      });
    }
  }
  static getFilters(params, filters) {
    let clientName,
      email,
      title,
      name,
      letterTemplateName,
      substateName,
      code,
      tagName;
    if (FlowRouter.current().route.path.indexOf("client/list") > -1) {
      clientName = FlowRouter.getQueryParam("clientName");
    }
    if (FlowRouter.current().route.path.indexOf("user/list") > -1) {
      email = FlowRouter.getQueryParam("email");
    }
    if (FlowRouter.current().route.path.indexOf("action/list") > -1) {
      title = FlowRouter.getQueryParam("title");
    }
    if (FlowRouter.current().route.path.indexOf("reports/list") > -1) {
      name = FlowRouter.getQueryParam("name");
    }
    if (FlowRouter.current().route.path.indexOf("letter-templates/list") > -1) {
      letterTemplateName = FlowRouter.getQueryParam("letterTemplateName");
    }
    if (FlowRouter.current().route.path.indexOf("substate/list") > -1) {
      substateName = FlowRouter.getQueryParam("substateName");
    }
    if (FlowRouter.current().route.path.indexOf("code/list") > -1) {
      code = FlowRouter.getQueryParam("code");
    }
    if (FlowRouter.current().route.path.indexOf("tag/list") > -1) {
      tagName = FlowRouter.getQueryParam("tagName");
    }

    if (clientName) {
      _.extend(params, {
        filters: { clientName: { $regex: clientName, $options: "i" } }
      });
    }
    if (email) {
      _.extend(params, {
        filters: { "emails.address": { $regex: email, $options: "i" } }
      });
    }
    if (title) {
      _.extend(params, {
        filters: { title: { $regex: title, $options: "i" } }
      });
    }
    if (name) {
      _.extend(params, {
        filters: { name: { $regex: name, $options: "i" } }
      });
    }
    if (letterTemplateName) {
      _.extend(params, {
        filters: { name: { $regex: letterTemplateName, $options: "i" } }
      });
    }

    if (code) {
      _.extend(params, {
        filters: { code: { $regex: code, $options: "i" } }
      });
    }
    if (tagName) {
      _.extend(params, {
        filters: { name: { $regex: tagName, $options: "i" } }
      });
    }
  }

  static getRange(page, perPage) {
    const lowest = (page - 1) * perPage + 1;
    const highest = lowest + perPage - 1;
    return { lowest, highest };
  }

  static getPagerOptions(page, perPage) {
    return {
      limit: perPage,
      skip: perPage * (page - 1)
    };
  }

  static setPage({ page, perPage, total }, inc) {
    const maxPage = this.getMaxPage(total, perPage);
    if (page + inc <= maxPage && page + inc >= 1) {
      return page + inc;
    } else {
      return page;
    }
  }

  static getMaxPage(total, perPage) {
    return total % perPage ? total / perPage + 1 : total / perPage;
  }
}
