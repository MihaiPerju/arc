import moment from "moment";
import stateEnum from "/imports/api/accounts/enums/states";
import UserRoles, { roleGroups } from "/imports/api/users/enums/roles";

export default class PagerService {
  static getQueryParams({
    page,
    perPage,
    state,
    assign,
    filters,
    options,
    route
  }) {
    let params = this.getPagerOptions(page, perPage);

    if (state || state === "" || (route && route.indexOf("flagged") > -1)) {
      this.getAccountFilters(params, state, filters, options, route);
      this.getProperAccounts(params, assign);
    } else {
      // common method for filtering
      this.getFilters(params, filters);
    }
    this.queryParams = params;
    return params;
  }

  static getProperAccounts(params, assign) {
    if (assign === "none") {
      _.extend(params.filters, {
        assigneeId: {
          $exists: true
        },
        workQueueId: {
          $exists: true
        }
      });
    } else if (assign) {
      const filterArr = assign.split(",");
      if (_.contains(filterArr, "assigneeId")) {
        _.extend(params.filters, {
          $or: [
            {
              workQueueId: {
                $in: filterArr
              }
            },
            {
              assigneeId: {
                $exists: true
              }
            }
          ]
        });
      } else {
        _.extend(params.filters, {
          workQueueId: {
            $in: filterArr
          }
        });
      }
    }
  }

  static getClientParams(params) {
    let queryParams = {};
    if (params) {
      let { clientName, createdAtMax, createdAtMin } = params.filters;
      let { page, perPage } = params.options;

      queryParams = this.getPagerOptions(page, perPage);
      queryParams.filters = {};

      if (clientName) {
        _.extend(queryParams.filters, {
          clientName: {
            $regex: clientName,
            $options: "i"
          }
        });
      }

      // created at search
      if (createdAtMin && createdAtMax) {
        _.extend(queryParams.filters, {
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
    }
    return queryParams;
  }

  static getUserParams(params) {
    let queryParams = {};
    if (params) {
      let { email } = params.filters;
      let { page, perPage } = params.options;

      queryParams = this.getPagerOptions(page, perPage);
      queryParams.filters = {};

      if (email) {
        _.extend(queryParams.filters, {
          "emails.address": {
            $regex: email,
            $options: "i"
          }
        });
      }
    }
    return queryParams;
  }

  static getRulesParams(params) {
    let queryParams = {};
    if (params) {
      let { name } = params.filters;
      let { page, perPage } = params.options;

      queryParams = this.getPagerOptions(page, perPage);
      queryParams.filters = {};

      if (name) {
        _.extend(queryParams.filters, {
          name: {
            $regex: name,
            $options: "i"
          }
        });
      }
    }
    return queryParams;
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
    },
    route
  ) {
    _.extend(params.options, {
      sort: {}
    });

    if (state === "unassigned") {
      _.extend(params, {
        filters: {
          assigneeId: null,
          workQueueId: null,
          tickleDate: null,
          employeeToRespond: null
        }
      });
    } else if (state === "tickles") {
      _.extend(params, {
        filters: {
          tickleDate: {
            $exists: true
          },
          employeeToRespond: null
        }
      });
      _.extend(params.options, {
        sort: {
          tickleDate: 1
        }
      });
      if (tickleUserId) {
        _.extend(params.filters, {
          tickleUserId: tickleUserId
        });
      } else if (Roles.userIsInRole(Meteor.userId(), roleGroups.MANAGER_REP)) {
        _.extend(params.filters, {
          tickleUserId: Meteor.userId()
        });
      }
    } else if (state === "escalated") {
      let employeeToRespond = null;
      if (Roles.userIsInRole(Meteor.userId(), UserRoles.MANAGER)) {
        employeeToRespond = "manager";
      } else if (Roles.userIsInRole(Meteor.userId(), UserRoles.REP)) {
        employeeToRespond = Meteor.userId();
      }

      _.extend(params, {
        filters: {
          tickleDate: null,
          employeeToRespond
        }
      });
    } else if (state && state !== "all") {
      state = stateEnum[state.toUpperCase()];
      _.extend(params, {
        filters: {
          state,
          tickleDate: null,
          employeeToRespond: null
        }
      });
    } else {
      // state undefined
      _.extend(params, {
        filters: {
          state: {
            $exists: true
          }
        }
      });
    }

    //adding filter query options
    if (acctNum) {
      _.extend(params, {
        filters: {
          acctNum: {
            $regex: acctNum,
            $options: "i"
          }
        }
      });
    }
    if (facilityId) {
      _.extend(params.filters, {
        facilityId
      });
    }
    if (clientId) {
      _.extend(params.filters, {
        clientId
      });
    }
    if (facCode) {
      _.extend(params.filters, {
        facCode
      });
    }
    if (ptType) {
      _.extend(params.filters, {
        ptType
      });
    }
    if (acctBalMin && acctBalMax) {
      _.extend(params.filters, {
        acctBal: {
          $gte: +acctBalMin,
          $lte: +acctBalMax
        }
      });
    } else if (acctBalMin) {
      _.extend(params.filters, {
        acctBal: {
          $gte: +acctBalMin
        }
      });
    } else if (acctBalMax) {
      _.extend(params.filters, {
        acctBal: {
          $lte: +acctBalMax
        }
      });
    }
    if (finClass) {
      _.extend(params.filters, {
        finClass
      });
    }
    if (substate) {
      _.extend(params.filters, {
        substate
      });
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
      _.extend(params.filters, {
        activeInsCode
      });
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
      _.extend(params.filters, {
        tagIds: {
          $in: tagIds
        }
      });
    }

    if (medNo) {
      _.extend(params.filters, {
        medNo: +medNo
      });
    }

    if (route && route.indexOf("/flagged") > -1) {
      _.extend(params.filters, {
        flagCounter: {
          $gt: 0
        }
      });
    }

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

  static getPagerOptions(page, perPage) {
    return {
      options: {
        limit: perPage,
        skip: perPage * (page - 1)
      }
    };
  }

  static getParams() {
    return this.queryParams;
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

  static getRange(page, perPage) {
    const lowest = (page - 1) * perPage + 1;
    const highest = lowest + perPage - 1;
    return {
      lowest,
      highest
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
