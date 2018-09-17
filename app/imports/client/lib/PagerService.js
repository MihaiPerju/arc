import moment from "moment";
import stateEnum from "/imports/api/accounts/enums/states";
import RolesEnum, { roleGroups } from "/imports/api/users/enums/roles";
import statuses from "/imports/api/files/enums/statuses";

export default class PagerService {
  queryParams;
  static setQuery(query, { page, perPage, state, assign, filters, options }) {
    let params = this.getPagerOptions(page, perPage);
    const { route } = FlowRouter.current();

    if (state || state === "" || route.path.indexOf("flagged") > -1) {
      this.getAccountFilters(params, state, filters, options);
      this.getProperAccounts(params, assign);
    } else {
      // common method for filtering
      this.getFilters(params, filters);
    }
    this.queryParams = params;
    return query.clone(params);
  }

  static getParams() {
    return this.queryParams;
  }

  static getAccountQueryParams() {
    const tickleUserId = FlowRouter.getQueryParam("tickleUserId");
    const page = FlowRouter.getQueryParam("page");
    const assign = FlowRouter.getQueryParam("assign");
    const facilityId = FlowRouter.getQueryParam("facilityId");
    const clientId = FlowRouter.getQueryParam("clientId");
    const acctNum = FlowRouter.getQueryParam("acctNum");
    const facCode = FlowRouter.getQueryParam("facCode");
    const ptType = FlowRouter.getQueryParam("ptType");
    const acctBalMin = FlowRouter.getQueryParam("acctBalMin");
    const acctBalMax = FlowRouter.getQueryParam("acctBalMax");
    const finClass = FlowRouter.getQueryParam("finClass");
    const substate = FlowRouter.getQueryParam("substate");
    const dischrgDateMin = FlowRouter.getQueryParam("dischrgDateMin");
    const dischrgDateMax = FlowRouter.getQueryParam("dischrgDateMax");
    const fbDateMin = FlowRouter.getQueryParam("fbDateMin");
    const fbDateMax = FlowRouter.getQueryParam("fbDateMax");
    const activeInsCode = FlowRouter.getQueryParam("activeInsCode");
    const admitDateMin = FlowRouter.getQueryParam("admitDateMin");
    const admitDateMax = FlowRouter.getQueryParam("admitDateMax");
    const tagIds = FlowRouter.getQueryParam("tagIds");
    const medNo = FlowRouter.getQueryParam("medNo");
    // sorting query params
    const sortAcctBal = FlowRouter.getQueryParam("sortAcctBal");
    const sortTickleDate = FlowRouter.getQueryParam("sortTickleDate");
    const sortCreatedAt = FlowRouter.getQueryParam("sortCreatedAt");
    const sortDischrgDate = FlowRouter.getQueryParam("sortDischrgDate");
    const sortFbDate = FlowRouter.getQueryParam("sortFbDate");
    const sortAdmitDate = FlowRouter.getQueryParam("sortAdmitDate");
    let state = FlowRouter.current().params.state;

    if (stateEnum.ACTIVE.toLowerCase() === state && acctNum) {
      state = "";
    }

    const perPage = 13;

    return {
      filters: {
        tickleUserId,
        facilityId,
        clientId,
        acctNum,
        facCode,
        ptType,
        acctBalMin,
        acctBalMax,
        finClass,
        substate,
        dischrgDateMin,
        dischrgDateMax,
        fbDateMin,
        fbDateMax,
        activeInsCode,
        admitDateMin,
        admitDateMax,
        tagIds,
        medNo
      },
      options: {
        sortAcctBal,
        sortTickleDate,
        sortCreatedAt,
        sortDischrgDate,
        sortFbDate,
        sortAdmitDate
      },
      page,
      perPage,
      state,
      assign
    };
  }
  static getFilesQueryParams() {
    const facilityId = FlowRouter.getQueryParam("facilityId");
    const clientId = FlowRouter.getQueryParam("clientId");
    const fileName = FlowRouter.getQueryParam("fileName");
    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;

    return {
      filters: {
        facilityId,
        clientId,
        fileName
      },
      page,
      perPage
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
      acctBalMin,
      acctBalMax,
      finClass,
      substate,
      dischrgDateMin,
      dischrgDateMax,
      fbDateMin,
      fbDateMax,
      activeInsCode,
      admitDateMin,
      admitDateMax,
      tickleUserId,
      tagIds,
      medNo
    },
    {
      sortAcctBal,
      sortTickleDate,
      sortCreatedAt,
      sortDischrgDate,
      sortFbDate,
      sortAdmitDate
    }
  ) {
    params.options = {};
    if (state === "unassigned") {
      _.extend(params, {
        filters: {
          assigneeId: null,
          workQueue: null,
          tickleDate: null,
          employeeToRespond: null
        }
      });
    } else if (state === "tickles") {
      _.extend(params, {
        filters: { tickleDate: { $exists: true }, employeeToRespond: null }
      });
      _.extend(params.options, {
        sort: {
          tickleDate: 1
        }
      });
      if (tickleUserId) {
        _.extend(params.filters, { tickleUserId: tickleUserId });
      } else if (Roles.userIsInRole(Meteor.userId(), roleGroups.MANAGER_REP)) {
        _.extend(params.filters, { tickleUserId: Meteor.userId() });
      }
    } else if (state === "escalated") {
      _.extend(params, {
        filters: {
          tickleDate: null,
          employeeToRespond: { $exists: true }
        }
      });
    } else if (state && state !== "all") {
      state = stateEnum[state.toUpperCase()];
      _.extend(params, {
        filters: { state, tickleDate: null, employeeToRespond: null }
      });
    } else {
      // state undefined
      _.extend(params, {
        filters: { state: { $exists: true } }
      });
    }

    //adding filter query options
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
    if (acctBalMin && acctBalMax) {
      _.extend(params.filters, {
        acctBal: { $gte: +acctBalMin, $lte: +acctBalMax }
      });
    } else if (acctBalMin) {
      _.extend(params.filters, {
        acctBal: { $gte: +acctBalMin }
      });
    } else if (acctBalMax) {
      _.extend(params.filters, {
        acctBal: { $lte: +acctBalMax }
      });
    }
    if (finClass) {
      _.extend(params.filters, { finClass });
    }
    if (substate) {
      _.extend(params.filters, { substate });
    }
    if (dischrgDateMin && dischrgDateMax) {
      _.extend(params.filters, {
        dischrgDate: {
          $gte: new Date(moment(new Date(dischrgDateMin)).startOf("day")),
          $lt: new Date(
            moment(new Date(dischrgDateMax))
              .startOf("day")
              .add(1, "day")
          )
        }
      });
    } else if (dischrgDateMin) {
      _.extend(params.filters, {
        dischrgDate: {
          $gte: new Date(moment(new Date(dischrgDateMin)).startOf("day"))
        }
      });
    } else if (dischrgDateMax) {
      _.extend(params.filters, {
        dischrgDate: {
          $lt: new Date(
            moment(new Date(dischrgDateMax))
              .startOf("day")
              .add(1, "day")
          )
        }
      });
    }
    if (fbDateMin && fbDateMax) {
      _.extend(params.filters, {
        fbDate: {
          $gte: new Date(moment(new Date(fbDateMin)).startOf("day")),
          $lt: new Date(
            moment(new Date(fbDateMax))
              .startOf("day")
              .add(1, "day")
          )
        }
      });
    } else if (fbDateMin) {
      _.extend(params.filters, {
        fbDate: {
          $gte: new Date(moment(new Date(fbDateMin)).startOf("day"))
        }
      });
    } else if (fbDateMax) {
      _.extend(params.filters, {
        fbDate: {
          $lt: new Date(
            moment(new Date(fbDateMax))
              .startOf("day")
              .add(1, "day")
          )
        }
      });
    }
    if (activeInsCode) {
      _.extend(params.filters, { activeInsCode });
    }

    if (admitDateMin && admitDateMax) {
      _.extend(params.filters, {
        admitDate: {
          $gte: new Date(moment(new Date(admitDateMin)).startOf("day")),
          $lt: new Date(
            moment(new Date(admitDateMax))
              .startOf("day")
              .add(1, "day")
          )
        }
      });
    } else if (admitDateMin) {
      _.extend(params.filters, {
        admitDate: {
          $gte: new Date(moment(new Date(admitDateMin)).startOf("day"))
        }
      });
    } else if (admitDateMax) {
      _.extend(params.filters, {
        admitDate: {
          $lt: new Date(
            moment(new Date(admitDateMax))
              .startOf("day")
              .add(1, "day")
          )
        }
      });
    }

    if (tagIds) {
      _.extend(params.filters, { tagIds: { $in: tagIds } });
    }

    if (medNo) {
      _.extend(params.filters, { medNo: +medNo });
    }

    if (FlowRouter.current().route.path.indexOf("/flagged") > -1) {
      _.extend(params, {
        flagged: true
      });
    }

    //adding sort query options

    _.extend(params, {
      options: { sort: {} }
    });

    if (sortCreatedAt) {
      _.extend(params.options.sort, {
        createdAt: sortCreatedAt === "ASC" ? 1 : -1
      });
    }

    if (sortDischrgDate) {
      _.extend(params.options.sort, {
        dischrgDate: sortDischrgDate === "ASC" ? 1 : -1
      });
    }

    if (sortFbDate) {
      _.extend(params.options.sort, {
        fbDate: sortFbDate === "ASC" ? 1 : -1
      });
    }

    if (sortAcctBal) {
      _.extend(params.options.sort, {
        acctBal: sortAcctBal === "ASC" ? 1 : -1
      });
    }

    if (sortAdmitDate) {
      _.extend(params.options.sort, {
        admitDate: sortAdmitDate === "ASC" ? 1 : -1
      });
    }

    if (sortTickleDate) {
      _.extend(params.options.sort, {
        tickleDate: sortTickleDate === "ASC" ? 1 : -1
      });
    }
  }

  static getFilters(params, filters) {
    let clientName,
      email,
      title,
      name,
      letterTemplateName,
      code,
      tagName,
      stateName,
      sortState,
      sortSubstate,
      facilityName,
      regionName,
      createdAtMin,
      createdAtMax,
      letterName,
      tagIds,
      fileName,
      clientId,
      facilityId,
      status;

    _.extend(params, {
      filters: {}
    });
    if(filters&&filters.status){
      status=filters.status
    }
    let currentPath = FlowRouter.current().route.path;

    if (currentPath.indexOf("client/list") > -1) {
      clientName = FlowRouter.getQueryParam("clientName");
      createdAtMin = FlowRouter.getQueryParam("createdAtMin");
      createdAtMax = FlowRouter.getQueryParam("createdAtMax");
    }

    if (currentPath.indexOf("user/list") > -1) {
      email = FlowRouter.getQueryParam("email");
    }

    if (currentPath.indexOf("action/list") > -1) {
      title = FlowRouter.getQueryParam("title");
    }

    if (currentPath.indexOf("reports/list") > -1) {
      name = FlowRouter.getQueryParam("name");
    }

    if (currentPath.indexOf("letter-templates/list") > -1) {
      letterTemplateName = FlowRouter.getQueryParam("letterTemplateName");
      _.extend(params, {
        expose: true
      });
    }

    if (currentPath.indexOf("substate/list") > -1) {
      stateName = FlowRouter.getQueryParam("stateName");
      sortState = FlowRouter.getQueryParam("sortState");
      sortSubstate = FlowRouter.getQueryParam("sortSubstate");
    }

    if (currentPath.indexOf("code/list") > -1) {
      code = FlowRouter.getQueryParam("code");
    }

    if (currentPath.indexOf("tag/list") > -1) {
      tagName = FlowRouter.getQueryParam("tagName");
    }

    if (currentPath.indexOf("/client/:_id/manage-facilities") > -1) {
      facilityName = FlowRouter.getQueryParam("facilityName");
      createdAtMin = FlowRouter.getQueryParam("createdAtMin");
      createdAtMax = FlowRouter.getQueryParam("createdAtMax");
      _.extend(params.filters, {
        clientId: FlowRouter.current().params._id
      });
    }

    if (currentPath.indexOf("/client/:id/region/list") > -1) {
      regionName = FlowRouter.getQueryParam("regionName");
      _.extend(params.filters, {
        clientId: FlowRouter.current().params.id
      });
    }

    if (currentPath.indexOf("letters/list") > -1) {
      letterName = FlowRouter.getQueryParam("letterTemplateName");
    }

    if (currentPath.indexOf("module-tags/list") > -1) {
      tagName = FlowRouter.getQueryParam("tagName");
    }

    if (currentPath.indexOf("file/list") > -1) {
      fileName = FlowRouter.getQueryParam("fileName");
      clientId = FlowRouter.getQueryParam("clientId");
      facilityId = FlowRouter.getQueryParam("facilityId");
      status = FlowRouter.getQueryParam("status");
    }

    tagIds = FlowRouter.getQueryParam("tagIds");

    // client search
    if (clientName) {
      _.extend(params.filters, {
        clientName: { $regex: clientName, $options: "i" }
      });
    }

    // user search
    if (email) {
      _.extend(params.filters, {
        "emails.address": { $regex: email, $options: "i" }
      });
    }

    // action search
    if (title) {
      _.extend(params.filters, {
        title: { $regex: title, $options: "i" }
      });
    }

    // reports search
    if (name) {
      _.extend(params.filters, {
        name: { $regex: name, $options: "i" }
      });
    }

    // letter-templates search
    if (letterTemplateName) {
      _.extend(params.filters, {
        name: { $regex: letterTemplateName, $options: "i" }
      });
    }

    // code search
    if (code) {
      _.extend(params.filters, {
        code: { $regex: code, $options: "i" }
      });
    }

    // substate search
    if (stateName) {
      _.extend(params.filters, {
        stateName: { $regex: stateName, $options: "i" }
      });
    }

    // tag search && module-tag
    if (tagName) {
      _.extend(params.filters, {
        name: { $regex: tagName, $options: "i" }
      });
    }

    // common filter query for tags filtering
    if (tagIds) {
      _.extend(params.filters, { tagIds: { $in: tagIds } });
    }

    // substates sorts
    if (sortState) {
      _.extend(params, {
        options: { sort: { stateName: sortState === "ASC" ? 1 : -1 } }
      });
    }
    if (sortSubstate) {
      _.extend(params, {
        options: { sort: { name: sortSubstate === "ASC" ? 1 : -1 } }
      });
    }

    // facility search
    if (facilityName) {
      _.extend(params.filters, {
        name: { $regex: facilityName, $options: "i" }
      });
    }

    // region search
    if (regionName) {
      _.extend(params.filters, { name: { $regex: regionName, $options: "i" } });
    }

    // created at search
    if (createdAtMin && createdAtMax) {
      _.extend(params.filters, {
        createdAt: {
          $gte: new Date(moment(new Date(createdAtMin)).startOf("day")),
          $lt: new Date(
            moment(new Date(createdAtMax))
              .add(1, "day")
              .startOf("day")
          )
        }
      });
    }

    // letters search
    if (letterName) {
      _.extend(params.filters, {
        letterTemplateName: { $regex: letterName, $options: "i" }
      });
    }

    // file search
    if (fileName) {
      _.extend(params.filters, {
        fileName: { $regex: fileName, $options: "i" }
      });
    }
    if (clientId) {
      _.extend(params.filters, {
        clientId: clientId
      });
    }
    if (facilityId) {
      _.extend(params.filters, {
        facilityId: facilityId
      });
    }
    
    if (status) {
      _.extend(params.filters, {
        status
      });
    } else {
      _.extend(params.filters, {
        status: { $ne: statuses.DISMISS }
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
