import moment from "moment";
import stateEnum from "/imports/api/accounts/enums/states";
import UserRoles, { roleGroups } from "/imports/api/users/enums/roles";
import statuses from "/imports/api/files/enums/statuses";
import Facilities from "/imports/api/facilities/collection";
import Users from "/imports/api/users/collection";
import RolesEnum from "/imports/api/users/enums/roles";

export default class QueryBuilder {
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
    let queryParams = { filters: {}, options: {} };
    if (params) {
      let { clientName, createdAtMax, createdAtMin } = params.filters;
      let { page, perPage } = params.options;

      this.getPagerOptions(queryParams, page, perPage);

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

      //Getting tags
      this.getTags(params, queryParams);
    }
    return queryParams;
  }

  static getUserParams(params) {
    let queryParams = { filters: {}, options: {} };
    if (params) {
      let { email } = params.filters;
      let { page, perPage } = params.options;

      this.getPagerOptions(queryParams, page, perPage);

      if (email) {
        _.extend(queryParams.filters, {
          "emails.address": {
            $regex: email,
            $options: "i"
          }
        });
      }

      //Getting tags
      this.getTags(params, queryParams);
    }
    return queryParams;
  }

  static getTagsParams(params) {
    let queryParams = { filters: {}, options: {} };
    if (params) {
      let { tagName } = params.filters;
      let { page, perPage } = params.options;

      this.getPagerOptions(queryParams, page, perPage);

      if (tagName) {
        _.extend(queryParams.filters, {
          name: {
            $regex: tagName,
            $options: "i"
          }
        });
      }
    }
    return queryParams;
  }

  static getRulesParams(params) {
    let queryParams = { filters: {}, options: {} };
    if (params) {
      let { name } = params.filters;
      let { page, perPage } = params.options;

      this.getPagerOptions(queryParams, page, perPage);

      if (name) {
        _.extend(queryParams.filters, {
          name: {
            $regex: name,
            $options: "i"
          }
        });
      }
      //Getting tags
      this.getTags(params, queryParams);
    }
    return queryParams;
  }

  static getCodesParams(params) {
    let queryParams = { filters: {}, options: {} };
    if (params) {
      let { code } = params.filters;
      let { page, perPage } = params.options;

      this.getPagerOptions(queryParams, page, perPage);

      if (code) {
        _.extend(queryParams.filters, {
          code: {
            $regex: code,
            $options: "i"
          }
        });
      }
      //Getting tags
      this.getTags(params, queryParams);
    }
    return queryParams;
  }

  static getTemplatesParams(params) {
    let queryParams = { filters: {}, options: {} };
    if (params) {
      let { letterTemplateName } = params.filters;
      let { page, perPage } = params.options;

      this.getPagerOptions(queryParams, page, perPage);

      if (letterTemplateName) {
        _.extend(queryParams.filters, {
          name: {
            $regex: letterTemplateName,
            $options: "i"
          }
        });
      }
      //Getting tags
      this.getTags(params, queryParams);
    }
    return queryParams;
  }

  static getLettersParams(params) {
    let queryParams = { filters: {}, options: {} };
    if (params) {
      let { letterName } = params.filters;
      let { page, perPage } = params.options;

      this.getPagerOptions(queryParams, page, perPage);

      if (letterName) {
        _.extend(queryParams.filters, {
          letterTemplateName: {
            $regex: letterName,
            $options: "i"
          }
        });
      }
      //Getting tags
      this.getTags(params, queryParams);
    }
    return queryParams;
  }

  static getActionsParams(params) {
    let queryParams = { filters: {}, options: {} };
    if (params) {
      let { title } = params.filters;
      let { page, perPage } = params.options;

      this.getPagerOptions(queryParams, page, perPage);

      // action search
      if (title) {
        _.extend(queryParams.filters, {
          title: {
            $regex: title,
            $options: "i"
          }
        });
      }
      //Getting tags
      this.getTags(params, queryParams);
    }
    return queryParams;
  }

  static getRegionsParams(params) {
    let queryParams = { filters: {}, options: {} };
    if (params) {
      let { regionName, clientId } = params.filters;
      let { page, perPage } = params.options;

      this.getPagerOptions(queryParams, page, perPage);

      // region search
      if (regionName) {
        _.extend(queryParams.filters, {
          name: {
            $regex: regionName,
            $options: "i"
          }
        });
      }
      if (clientId) {
        _.extend(queryParams.filters, {
          clientId
        });
      }
      //Getting tags
      this.getTags(params, queryParams);
    }
    return queryParams;
  }

  static getFacilitiesParams(params) {
    let queryParams = { filters: {}, options: {} };
    if (params) {
      let {
        facilityName,
        createdAtMax,
        createdAtMin,
        clientId
      } = params.filters;
      let { page, perPage } = params.options;

      this.getPagerOptions(queryParams, page, perPage);

      if (clientId) {
        _.extend(queryParams.filters, {
          clientId
        });
      }

      if (facilityName) {
        _.extend(queryParams.filters, {
          name: {
            $regex: facilityName,
            $options: "i"
          }
        });
      }

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
      //Getting tags
      this.getTags(params, queryParams);
    }
    return queryParams;
  }

  static getFilesParams(params) {
    let queryParams = { filters: {}, options: {} };
    if (params) {
      let { fileName, clientId, facilityId, status } = params.filters;
      let { page, perPage } = params.options;

      this.getPagerOptions(queryParams, page, perPage);

      // file search
      if (fileName) {
        _.extend(queryParams.filters, {
          fileName: {
            $regex: fileName,
            $options: "i"
          }
        });
      }
      if (clientId) {
        _.extend(queryParams.filters, {
          clientId
        });
      }
      if (facilityId) {
        _.extend(queryParams.filters, {
          facilityId: facilityId
        });
      }

      if (status) {
        _.extend(queryParams.filters, {
          status
        });
      } else {
        _.extend(queryParams.filters, {
          status: {
            $ne: statuses.DISMISS
          }
        });
      }
      //Getting tags
      this.getTags(params, queryParams);
    }
    return queryParams;
  }

  static getSubstatesParams(params) {
    let queryParams = { filters: {}, options: {} };
    if (params) {
      let { stateName } = params.filters;
      let { page, perPage, sortState, sortSubstate } = params.options;

      this.getPagerOptions(queryParams, page, perPage);

      if (stateName) {
        _.extend(queryParams.filters, {
          stateName: {
            $regex: stateName,
            $options: "i"
          }
        });
      }

      if (sortState) {
        _.extend(queryParams, {
          options: {
            sort: {
              stateName: sortState === "ASC" ? 1 : -1
            }
          }
        });
      }
      if (sortSubstate) {
        _.extend(queryParams, {
          options: {
            sort: {
              name: sortSubstate === "ASC" ? 1 : -1
            }
          }
        });
      }
      //Getting tags
      this.getTags(params, queryParams);
    }
    return queryParams;
  }

  static getReportsParams(params) {
    let queryParams = { filters: {}, options: {} };
    if (params) {
      let { name, facCode, ptType } = params.filters;
      let { page, perPage } = params.options;

      this.getPagerOptions(queryParams, page, perPage);

      if (name) {
        _.extend(queryParams.filters, {
          name: {
            $regex: name,
            $options: "i"
          }
        });
      }
      if (facCode) {
        _.extend(queryParams.filters, {
          "filterBuilderData.facCode": {
            $regex: `${facCode}.*`,
            $options: "i"
          }
        });
      }
      if (ptType) {
        _.extend(queryParams.filters, {
          "filterBuilderData.ptType": {
            $regex: `${ptType}.*`,
            $options: "i"
          }
        });
      }
      //Getting tags
      this.getTags(params, queryParams);
    }
    return queryParams;
  }

  static getTags(params, queryParams) {
    if (params) {
      let { tagIds } = params.filters;
      // common filter query for tags filtering
      if (tagIds) {
        _.extend(queryParams.filters, {
          tagIds: {
            $in: tagIds
          }
        });
      }
    }
  }

  static getAccountParams(params, userId) {
    let queryParams = { filters: {}, options: {} };
    if (params) {
      let {
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
        state
      } = params.filters;
      let {
        perPage,
        page,
        sortAcctBal,
        sortTickleDate,
        sortCreatedAt,
        sortDischrgDate,
        sortFbDate,
        sortAdmitDate
      } = params.options;

      this.getPagerOptions(queryParams, page, perPage);
      this.secureAccounts(queryParams, params, userId);

      if (state === "unassigned") {
        _.extend(queryParams.filters, {
          assigneeId: null,
          workQueueId: null,
          tickleDate: null,
          employeeToRespond: null
        });
      } else if (state === "tickles") {
        _.extend(queryParams.filters, {
          tickleDate: {
            $exists: true
          },
          employeeToRespond: null
        });
        _.extend(queryParams.options, {
          sort: {
            tickleDate: 1
          }
        });
        if (tickleUserId) {
          _.extend(queryParams.filters, {
            tickleUserId: tickleUserId
          });
        } else if (
          Roles.userIsInRole(Meteor.userId(), roleGroups.MANAGER_REP)
        ) {
          _.extend(queryParams.filters, {
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

        _.extend(queryParams.filters, {
          tickleDate: null,
          employeeToRespond
        });
      } else if (state === "flagged") {
        _.extend(queryParams.filters, {
          flagCounter: {
            $gt: 0
          }
        });
      } else if (state && state !== "all") {
        state = stateEnum[state.toUpperCase()];
        _.extend(queryParams.filters, {
          state,
          tickleDate: null,
          employeeToRespond: null
        });
      } else {
        // state undefined
        _.extend(queryParams.filters, {
          state: {
            $exists: true
          }
        });
      }

      //adding filter query options
      if (acctNum) {
        _.extend(queryParams.filters, {
          acctNum: {
            $regex: acctNum,
            $options: "i"
          }
        });
      }

      //Don't get the pending accounts while we don't have specific account number
      if (!acctNum) {
        _.extend(queryParams.filters, {
          isPending: false
        });
      }

      if (facilityId) {
        _.extend(queryParams.filters, {
          facilityId
        });
      }
      if (clientId) {
        _.extend(queryParams.filters, {
          clientId
        });
      }
      if (facCode) {
        _.extend(queryParams.filters, {
          facCode
        });
      }
      if (ptType) {
        _.extend(queryParams.filters, {
          ptType
        });
      }
      if (acctBalMin && acctBalMax) {
        _.extend(queryParams.filters, {
          acctBal: {
            $gte: +acctBalMin,
            $lte: +acctBalMax
          }
        });
      } else if (acctBalMin) {
        _.extend(queryParams.filters, {
          acctBal: {
            $gte: +acctBalMin
          }
        });
      } else if (acctBalMax) {
        _.extend(queryParams.filters, {
          acctBal: {
            $lte: +acctBalMax
          }
        });
      }
      if (finClass) {
        _.extend(queryParams.filters, {
          finClass
        });
      }
      if (substate) {
        _.extend(queryParams.filters, {
          substate
        });
      }
      if (dischrgDateMin && dischrgDateMax) {
        _.extend(queryParams.filters, {
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
        _.extend(queryParams.filters, {
          dischrgDate: {
            $gte: new Date(moment(new Date(dischrgDateMin)).startOf("day"))
          }
        });
      } else if (dischrgDateMax) {
        _.extend(queryParams.filters, {
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
        _.extend(queryParams.filters, {
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
        _.extend(queryParams.filters, {
          fbDate: {
            $gte: new Date(moment(new Date(fbDateMin)).startOf("day"))
          }
        });
      } else if (fbDateMax) {
        _.extend(queryParams.filters, {
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
        _.extend(queryParams.filters, {
          activeInsCode
        });
      }

      if (admitDateMin && admitDateMax) {
        _.extend(queryParams.filters, {
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
        _.extend(queryParams.filters, {
          admitDate: {
            $gte: new Date(moment(new Date(admitDateMin)).startOf("day"))
          }
        });
      } else if (admitDateMax) {
        _.extend(queryParams.filters, {
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
        _.extend(queryParams.filters, {
          tagIds: {
            $in: tagIds
          }
        });
      }

      if (medNo) {
        _.extend(queryParams.filters, {
          medNo: +medNo
        });
      }

      if (sortCreatedAt) {
        _.extend(queryParams.options.sort, {
          createdAt: sortCreatedAt === "ASC" ? 1 : -1
        });
      }

      if (sortDischrgDate) {
        _.extend(queryParams.options.sort, {
          dischrgDate: sortDischrgDate === "ASC" ? 1 : -1
        });
      }

      if (sortFbDate) {
        _.extend(queryParams.options.sort, {
          fbDate: sortFbDate === "ASC" ? 1 : -1
        });
      }

      if (sortAcctBal) {
        _.extend(queryParams.options.sort, {
          acctBal: sortAcctBal === "ASC" ? 1 : -1
        });
      }

      if (sortAdmitDate) {
        _.extend(queryParams.options.sort, {
          admitDate: sortAdmitDate === "ASC" ? 1 : -1
        });
      }

      if (sortTickleDate) {
        _.extend(queryParams.options.sort, {
          tickleDate: sortTickleDate === "ASC" ? 1 : -1
        });
      }
    }
    return queryParams;
  }

  static secureAccounts(queryParams, params, userId) {
    const user = Users.findOne({ _id: userId });
    let clientIds = [];
    let tagIds =[];

    if (user) {
      clientIds = user.clientIds;
      tagIds = user.tagIds;
    }
    const userFacilities = Facilities.find(
      {
        allowedUsers: {
          $in: [this.userId]
        }
      },
      {
        fields: {
          _id: 1
        }
      }
    ).fetch();

    let userFacilitiesArr = [];
    for (let element of userFacilities) {
      userFacilitiesArr.push(element._id);
    }

    //Secure for Managers
    if (Roles.userIsInRole(userId, RolesEnum.MANAGER)) {
      _.extend(queryParams.filters, {
        clientId: { $in: clientIds }
      });
    } else if (Roles.userIsInRole(userId, RolesEnum.REP)) {

      //Getting only the escalated accounts that are open and the rep is the author
      if (!tagIds) {
        tagIds = [];
      }
      _.extend(queryParams.filters, {
            $or: [
              {
                assigneeId: userId
              },
              {
                workQueueId: {
                  $in: tagIds
                }
              },
            ]
      });
    }
  }

  static getPagerOptions(params, page, perPage) {
    _.extend(params.options, {
      limit: perPage,
      skip: perPage * (page - 1)
    });
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
