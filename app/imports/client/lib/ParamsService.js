import moment from "moment";
import stateEnum from "/imports/api/accounts/enums/states";
import UserRoles, { roleGroups } from "/imports/api/users/enums/roles";

export default class ParamsService {
  static getPagerOptions(page, perPage) {
    return {
      limit: perPage,
      skip: perPage * (page - 1)
    };
  }

  static getParams() {
    return this.params;
  }

  static getAccountParams() {
    //Filter Params
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
    const placementDateMin = FlowRouter.getQueryParam("placementDateMin");
    const placementDateMax = FlowRouter.getQueryParam("placementDateMax");
    const medNo = FlowRouter.getQueryParam("medNo");
    let tagIds = this.getTags();

    // Sort Params
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
        medNo,
        state,
        assign,
        placementDateMin,
        placementDateMax
      },
      options: {
        page,
        perPage,
        sortAcctBal,
        sortTickleDate,
        sortCreatedAt,
        sortDischrgDate,
        sortFbDate,
        sortAdmitDate
      }
    };
  }

  static getFilesQueryParams() {
    const facilityId = FlowRouter.getQueryParam("facilityId");
    const clientId = FlowRouter.getQueryParam("clientId");
    const fileName = FlowRouter.getQueryParam("fileName");
    let tagIds = this.getTags();
    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;

    return {
      filters: {
        facilityId,
        clientId,
        fileName,
        tagIds
      },
      page,
      perPage
    };
  }

  static getClientParams() {
    let clientName = FlowRouter.getQueryParam("clientName");
    let createdAtMin = FlowRouter.getQueryParam("createdAtMin");
    let createdAtMax = FlowRouter.getQueryParam("createdAtMax");
    let tagIds = this.getTags();

    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;

    return {
      filters: {
        clientName,
        createdAtMax,
        createdAtMin,
        tagIds
      },
      options: {
        page,
        perPage
      }
    };
  }

  static getUserParams() {
    let email = FlowRouter.getQueryParam("email");
    let tagIds = this.getTags();

    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;

    return {
      filters: {
        email,
        tagIds
      },
      options: {
        page,
        perPage
      }
    };
  }

  static getRulesParams() {
    let name = FlowRouter.getQueryParam("name");
    let tagIds = this.getTags();
    let clientId = FlowRouter._current.params.clientId;

    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;

    return {
      filters: {
        name,
        tagIds,
        clientId
      },
      options: {
        page,
        perPage
      }
    };
  }

  static getCodesParams() {
    let code = FlowRouter.getQueryParam("code");
    let tagIds = this.getTags();

    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;

    return {
      filters: {
        code,
        tagIds
      },
      options: {
        page,
        perPage
      }
    };
  }

  static getLettersParams() {
    let letterName = FlowRouter.getQueryParam("letterTemplateName");
    let tagIds = this.getTags();

    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;

    return {
      filters: {
        letterName,
        tagIds
      },
      options: {
        page,
        perPage
      }
    };
  }

  static getActionsParams() {
    let title = FlowRouter.getQueryParam("title");
    let tagIds = this.getTags();

    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;

    return {
      filters: {
        title,
        tagIds
      },
      options: {
        page,
        perPage
      }
    };
  }

  static getFilesParams() {
    let fileName = FlowRouter.getQueryParam("fileName");
    let clientId = FlowRouter.getQueryParam("clientId");
    let facilityId = FlowRouter.getQueryParam("facilityId");
    let status = FlowRouter.getQueryParam("status");
    let tagIds = this.getTags();

    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;

    return {
      filters: {
        fileName,
        clientId,
        facilityId,
        status,
        tagIds
      },
      options: {
        page,
        perPage
      }
    };
  }

  static getFacilitiesParams() {
    let facilityName = FlowRouter.getQueryParam("facilityName");
    let createdAtMin = FlowRouter.getQueryParam("createdAtMin");
    let createdAtMax = FlowRouter.getQueryParam("createdAtMax");
    let clientId = FlowRouter.current().params._id;
    let tagIds = this.getTags();

    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;

    return {
      filters: {
        facilityName,
        clientId,
        createdAtMin,
        createdAtMax,
        tagIds
      },
      options: {
        page,
        perPage
      }
    };
  }

  static getTagsParams() {
    let tagName = FlowRouter.getQueryParam("tagName");

    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;

    return {
      filters: {
        tagName
      },
      options: {
        page,
        perPage
      }
    };
  }
  static getWorkQueuesParams() {
    let workQueueName = FlowRouter.getQueryParam("workQueueName");
    let clientId = FlowRouter.current().params.clientId;
    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;

    return {
      filters: {
        workQueueName,
        clientId
      },
      options: {
        page,
        perPage
      }
    };
  }

  static getRegionsParams() {
    let regionName = FlowRouter.getQueryParam("regionName");
    let clientId = FlowRouter.current().params.id;
    let tagIds = this.getTags();

    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;

    return {
      filters: {
        regionName,
        clientId,
        tagIds
      },
      options: {
        page,
        perPage
      }
    };
  }

  static getSubstatesParams() {
    let stateName = FlowRouter.getQueryParam("stateName");
    let sortState = FlowRouter.getQueryParam("sortState");
    let sortSubstate = FlowRouter.getQueryParam("sortSubstate");
    let tagIds = this.getTags();

    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;

    return {
      filters: {
        stateName,
        tagIds
      },
      options: {
        page,
        perPage,
        sortState,
        sortSubstate
      }
    };
  }

  static getReportsParams() {
    let name = FlowRouter.getQueryParam("name");
    let type = FlowRouter.getQueryParam("type");
    let createdAtMin = FlowRouter.getQueryParam("createdAtMin");
    let createdAtMax = FlowRouter.getQueryParam("createdAtMax");
    let tagIds = this.getTags();

    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;

    return {
      filters: {
        name,
        tagIds,
        type,
        createdAtMin,
        createdAtMax
      },
      options: {
        page,
        perPage
      }
    };
  }

  static getTemplatesParams() {
    let letterTemplateName = FlowRouter.getQueryParam("letterTemplateName");
    let tagIds = this.getTags();

    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;

    return {
      filters: {
        letterTemplateName,
        tagIds
      },
      options: {
        page,
        perPage
      }
    };
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
      medNo,
      placementDateMin,
      placementDateMax
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
    params.options = {
      sort: {}
    };
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

    if (placementDateMin && placementDateMax) {
      _.extend(params.filters, {
        placementDate: {
          $gte: new Date(moment(new Date(placementDateMin)).startOf("day")),
          $lt: new Date(
            moment(new Date(placementDateMax))
              .startOf("day")
              .add(1, "day")
          )
        }
      });
    } else if (placementDateMin) {
      _.extend(params.filters, {
        placementDate: {
          $gte: new Date(moment(new Date(placementDateMin)).startOf("day"))
        }
      });
    } else if (placementDateMax) {
      _.extend(params.filters, {
        placementDate: {
          $lt: new Date(
            moment(new Date(placementDateMax))
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

    if (FlowRouter.current().route.path.indexOf("/flagged") > -1) {
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

  static getTags() {
    let tagIds = FlowRouter.getQueryParam("tagIds");
    return tagIds;
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
