import moment from "moment";
export default class FilterService {
  static formatDate(date) {
    return date ? new Date(date).toString() : null;
  }

  static getFilterParams() {
    const queryParams = FlowRouter.current().queryParams;
    const model = {
      dischrgDateMin: null,
      dischrgDateMax: null,
      fbDateMin: null,
      fbDateMax: null,
      admitDateMin: null,
      admitDateMax: null
    };

    if ("acctNum" in queryParams) {
      model.acctNum = queryParams.acctNum;
    }
    if ("tickleUserId" in queryParams) {
      model.tickleUserId = queryParams.tickleUserId;
    }
    if ("clientId" in queryParams) {
      model.clientId = queryParams.clientId;
    }
    if ("facilityId" in queryParams) {
      model.facilityId = queryParams.facilityId;
    }
    if ("facCode" in queryParams) {
      model.facCode = queryParams.facCode;
    }
    if ("ptType" in queryParams) {
      model.ptType = queryParams.ptType;
    }
    if ("acctBalMin" in queryParams) {
      model.acctBalMin = queryParams.acctBalMin;
    }
    if ("acctBalMax" in queryParams) {
      model.acctBalMax = queryParams.acctBalMax;
    }
    if ("finClass" in queryParams) {
      model.finClass = queryParams.finClass;
    }
    if ("substate" in queryParams) {
      model.substate = queryParams.substate;
    }
    if ("activeInsCode" in queryParams) {
      model.activeInsCode = queryParams.activeInsCode;
    }
    if ("dischrgDateMin" in queryParams) {
      model.dischrgDateMin = moment(new Date(queryParams.dischrgDateMin));
    }
    if ("dischrgDateMax" in queryParams) {
      model.dischrgDateMax = moment(new Date(queryParams.dischrgDateMax));
    }
    if ("fbDateMin" in queryParams) {
      model.fbDateMin = moment(new Date(queryParams.fbDateMin));
    }
    if ("fbDateMax" in queryParams) {
      model.fbDateMax = moment(new Date(queryParams.fbDateMax));
    }
    if ("admitDateMin" in queryParams) {
      model.admitDateMin = moment(new Date(queryParams.admitDateMin));
    }
    if ("admitDateMax" in queryParams) {
      model.admitDateMax = moment(new Date(queryParams.admitDateMax));
    }

    return model;
  }
}
