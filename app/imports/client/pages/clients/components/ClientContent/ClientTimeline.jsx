import React, { Component } from "react";
import moment from "moment";
import { AutoForm, SelectField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import Loading from "/imports/client/lib/ui/Loading";
import actionTypesEnum, {
  typeList
} from "/imports/api/accounts/enums/actionTypesEnum";
import substateQuery from "/imports/api/substates/queries/listSubstates";
import ClientService from "../../services/ClientService";
import { rolesTypes } from "/imports/api/clients/enums/contactTypes";
import filterTypeEnums from "../../enums/filterTypes";
import TimelineItem from "./TimelineItem";
import Dialog from "/imports/client/lib/ui/Dialog";
import Notifier from "/imports/client/lib/Notifier";

export default class ClientTimeline extends Component {
  constructor() {
    super();
    this.state = {
      actionTypes: [],
      substates: [],
      model: {},
      weekToDate: false,
      monthToDate: false,
      yearToDate: false,
      lastSevenDays: false,
      lastThirtyDays: false,
      lastTwelveMonths: false,
      yesterday: false,
      lastWeek: false,
      lastMonth: false,
      userRoles: [],
      accounts: [],
      accountActions: [],
      limit: 10,
      skip: 0,
      isScrollLoading: false,
      dialogIsActive: false
    };
  }

  componentWillMount() {
    const actionTypes = [],
      substates = [],
      userRoles = [];

    typeList.map(type => {
      actionTypes.push({ label: type, value: type });
    });

    rolesTypes.map(type => {
      userRoles.push({ label: type, value: type });
    });
    this.setState({
      userRoles,
      actionTypes
    });

    substateQuery
      .clone({
        filters: { status: true }
      })
      .fetch((err, res) => {
        if (!err) {
          res.map(substate => {
            const label = `${substate.stateName}: ${substate.name}`;
            substates.push({
              label: label,
              value: substate.name
            });
          });
          this.setState({ substates });
        }
      });

    const { model, state } = ClientService.getFilterParams();
    const { clientId } = this.props;
    const { limit, skip } = this.state;
    this.getActions(clientId, limit, skip);

    this.setState({
      model,
      weekToDate: state.weekToDate,
      monthToDate: state.monthToDate,
      yearToDate: state.yearToDate,
      lastSevenDays: state.lastSevenDays,
      lastThirtyDays: state.lastThirtyDays,
      lastTwelveMonths: state.lastTwelveMonths,
      yesterday: state.yesterday,
      lastWeek: state.lastWeek,
      lastMonth: state.lastMonth,
      clientId
    });
  }

  componentDidMount() {
    const { isScroll } = this.refs;
    if (isScroll) {
      isScroll.addEventListener("scroll", this.onHandleScroll);
    }
  }

  componentWillReceiveProps(props) {
    const { clientId } = props;
    if (clientId !== this.state.clientId) {
      // set the limit to initial value
      this.setState({ clientId, limit: 10, skip: 0, accountActions: [] });
      const { limit, skip } = this.state;
      this.getActions(clientId, limit, skip);
    }
  }

  componentWillUnmount() {
    this.resetFilters();
  }

  getFilterParams = () => {
    const queryParams = FlowRouter.current().queryParams;
    const model = {};

    if ("type" in queryParams) {
      model.type = queryParams.type;
    }

    if ("substate" in queryParams) {
      model.substate = queryParams.substate;
    }

    if ("role" in queryParams) {
      model.role = queryParams.role;
    }

    if ("last-n-days" in queryParams) {
      if (queryParams["last-n-days"] === 7) {
        this.setState({ lastSevenDays: true });
      } else {
        this.setState({ lastThirtyDays: true });
      }
    }

    if ("last-n-months" in queryParams) {
      this.setState({ lastTwelveMonths: true });
    }

    if ("weekToDate" in queryParams) {
      this.setState({ weekToDate: true });
    }

    if ("monthToDate" in queryParams) {
      this.setState({ monthToDate: true });
    }

    if ("yearToDate" in queryParams) {
      this.setState({ yearToDate: true });
    }

    if ("yesterday" in queryParams) {
      this.setState({ yesterday: true });
    }

    if ("lastWeek" in queryParams) {
      this.setState({ lastWeek: true });
    }

    if ("lastMonth" in queryParams) {
      this.setState({ lastMonth: true });
    }

    // work on the check inputs

    this.setState({ model });
  };

  openDialog = () => {
    this.setState({
      dialogIsActive: true
    });
  };

  closeDialog = () => {
    this.setState({
      dialogIsActive: false
    });
  };

  onHandleScroll = () => {
    const { skip, accountActions } = this.state;
    const { isScroll } = this.refs;
    const { scrollTop, scrollHeight, clientHeight } = isScroll;
    const scrolledToBottom =
      Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    if (scrolledToBottom && skip <= accountActions.length) {
      this.setState({ isScrollLoading: true });
      this.loadMoreItems();
    }
  };

  loadMoreItems = () => {
    let { limit, skip } = this.state;
    const { clientId } = this.props;
    skip = skip + limit;
    this.setState({ limit, skip });
    this.getActions(clientId, limit, skip);
  };

  getActions = (clientId, limit, skip) => {
    const params = ClientService.getActionsQueryParams(clientId);
    _.extend(params, {
      options: { limit, skip }
    });

    Meteor.call("accountActions.get", params, (err, actions) => {
      if (!err) {
        let { accountActions } = this.state;
        accountActions = accountActions.concat(actions);
        this.setState({
          accountActions,
          isScrollLoading: false
        });
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  onSubmit = params => {
    const {
      model,
      weekToDate,
      monthToDate,
      yearToDate,
      lastSevenDays,
      lastThirtyDays,
      lastTwelveMonths,
      yesterday,
      lastWeek,
      lastMonth
    } = this.state;
    if ("type" in params) {
      FlowRouter.setQueryParams({ type: params.type });
      model.type = params.type;
    }
    if ("substate" in params) {
      FlowRouter.setQueryParams({ substate: params.substate });
      model.substate = params.substate;
    }
    if ("role" in params) {
      FlowRouter.setQueryParams({ role: params.role });
      model.role = params.role;
    }

    if (weekToDate) {
      FlowRouter.setQueryParams({ weekToDate: true });
    }

    if (monthToDate) {
      FlowRouter.setQueryParams({ monthToDate: true });
    }

    if (yearToDate) {
      FlowRouter.setQueryParams({ yearToDate: true });
    }

    if (lastSevenDays) {
      FlowRouter.setQueryParams({ "last-n-days": 7 });
    }

    if (lastThirtyDays) {
      FlowRouter.setQueryParams({ "last-n-days": 30 });
    }

    if (lastTwelveMonths) {
      FlowRouter.setQueryParams({ "last-n-months": 12 });
    }

    if (yesterday) {
      FlowRouter.setQueryParams({ yesterday: true });
    }

    if (lastWeek) {
      FlowRouter.setQueryParams({ lastWeek: true });
    }

    if (lastMonth) {
      FlowRouter.setQueryParams({ lastMonth: true });
    }

    this.setState({ model });
    this.closeDialog();
  };

  handleClick = key => {
    const flag = !this.state[key];
    if (key === filterTypeEnums.LAST_SEVEN_DAYS) {
      this.setState({
        lastSevenDays: flag,
        lastThirtyDays: false
      });
    } else if (key === filterTypeEnums.LAST_THIRTY_DAYS) {
      this.setState({
        lastSevenDays: false,
        lastThirtyDays: flag
      });
    } else if (key === filterTypeEnums.LAST_TWELVE_MONTHS) {
      this.setState({
        lastTwelveMonths: flag
      });
    } else if (key) {
      this.setState({
        [key]: flag
      });
    }
  };

  getTimelineIcon = type => {
    switch (type) {
      case actionTypesEnum.USER_ACTION:
        return <i className="icon-thumb-tack" />;
      case actionTypesEnum.SYSTEM_ACTION:
        return <i className="icon-alert" />;
      case actionTypesEnum.COMMENT:
        return <i className="icon-comments-o" />;
      case actionTypesEnum.LETTER:
        return <i className="icon-inbox" />;
      case actionTypesEnum.FILE:
        return <i className="icon-file-text-o" />;
      case actionTypesEnum.REVERT:
        return <i className="icon-file-text-o" />;
      case actionTypesEnum.FLAG:
        return <i className="icon-flag" />;
      case actionTypesEnum.EDIT:
        return <i className="icon-pencil" />;
      case actionTypesEnum.LOCK_BREAK:
        return <i className="icon-lock" />;
    }
  };

  getTimelineBody = data => {
    const {
      type,
      action,
      reasonCode,
      content,
      letterTemplate,
      fileName,
      user,
      actionId,
      isOpen,
      flagResponse,
      isFlagApproved,
      manager,
      account,
      fieldUpdatedValue,
      fieldPreviousValue,
      accountField,
      filetype,
      numberOfRecords
    } = data;

    switch (type) {
      case actionTypesEnum.USER_ACTION:
        return (
          <div>
            {action && (
              <div>
                {user && (
                  <b>
                    {user.profile.firstName} {user.profile.lastName}
                  </b>
                )}{" "}
                applied action <b>{action.title}</b> to account with Account
                Number <b>{account && account.acctNum}</b>
              </div>
            )}
            {reasonCode && <div>Reason Code: {reasonCode}</div>}
          </div>
        );
      case actionTypesEnum.SYSTEM_ACTION:
        return (
          <div>
            {action && (
              <div>
                Applied system action <b>{action.title}</b> to account.
              </div>
            )}
          </div>
        );
      case actionTypesEnum.COMMENT:
        return (
          <div>
            {user && (
              <b>
                {user.profile.firstName} {user.profile.lastName}
              </b>
            )}{" "}
            commented a comment <b>{content}</b> to account with Account Number{" "}
            <b>{account && account.acctNum}</b>
          </div>
        );
      case actionTypesEnum.LETTER:
        return (
          <div>
            {letterTemplate && (
              <div>
                {user && (
                  <b>
                    {user.profile.firstName} {user.profile.lastName}
                  </b>
                )}{" "}
                send a letter with letter-template name{" "}
                <b>{letterTemplate.name}</b> to account with account number{" "}
                <b>{account && account.acctNum}</b>
              </div>
            )}
          </div>
        );
      case actionTypesEnum.FILE:
        return (
          <div>
            {fileName && (
              <div>
                {user && (
                  <b>
                    {user.profile.firstName} {user.profile.lastName}
                  </b>
                )}{" "}
                uploaded <b>{filetype}</b> file{" "}
                <b>
                  {this.getFileName(fileName)}
                  .csv
                </b>{" "}
                with <b>{numberOfRecords} accounts</b>.
              </div>
            )}
          </div>
        );
      case actionTypesEnum.REVERT:
        return (
          <div>
            {fileName && (
              <div>
                {user && (
                  <b>
                    {user.profile.firstName} {user.profile.lastName}
                  </b>
                )}{" "}
                reverted file{" "}
                <b>
                  {this.getFileName(fileName)}
                  .csv
                </b>
              </div>
            )}
          </div>
        );
      case actionTypesEnum.FLAG:
        return (
          <div>
            {actionId ? (
              <div>
                <b>
                  {user.profile.firstName} {user.profile.lastName}
                </b>{" "}
                flagged an action on account <b>{account && account.acctNum}</b>
                .
                {!isOpen && (
                  <div>
                    <br />
                    Manager{" "}
                    <b>
                      {manager.profile.firstName} {manager.profile.lastName}
                    </b>{" "}
                    has responsed to the action and{" "}
                    {isFlagApproved ? <b>approved</b> : <b>rejected</b>} the
                    flag with reason <b>{flagResponse}</b>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <b>
                  {user.profile.firstName} {user.profile.lastName}
                </b>{" "}
                flagged a comment on account <b>{account && account.acctNum}</b>
                .
                {!isOpen && (
                  <div>
                    <br />
                    Manager{" "}
                    <b>
                      {manager.profile.firstName} {manager.profile.lastName}
                    </b>{" "}
                    has responsed to a comment and{" "}
                    {isFlagApproved ? <b>approved</b> : <b>rejected</b>} the
                    flag with reason <b>{flagResponse}</b>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case actionTypesEnum.EDIT:
        return (
          <div>
            {fieldPreviousValue ? (
              <div>
                <b>
                  {user.profile.firstName} {user.profile.lastName}
                </b>{" "}
                updated the account <b>{account && account.acctNum}</b> with
                value <b>{fieldPreviousValue}</b> to <b>{fieldUpdatedValue}</b>{" "}
                in the field <b>{accountField}</b>.
              </div>
            ) : (
              <div>
                <b>
                  {user.profile.firstName} {user.profile.lastName}
                </b>{" "}
                updated the account <b>{account && account.acctNum}</b> and
                added the value <b>{fieldUpdatedValue}</b> in the field{" "}
                <b>{accountField}</b>.
              </div>
            )}
          </div>
        );
      case actionTypesEnum.LOCK_BREAK:
        return (
          <div>
            {user && (
              <b>
                {user.profile.firstName} {user.profile.lastName}
              </b>
            )}{" "}
            broke the lock of the account with Account Number{" "}
            <b>{account && account.acctNum}</b>
          </div>
        );
      default:
        return "";
    }
  };

  getFileName = name => {
    return name.split(".")[0] || "";
  };

  resetFilters = () => {
    const { filters } = this.refs;
    if (filters) {
      filters.reset();
    }
    const appliedFilters = {
      type: null,
      substate: null,
      role: null,
      weekToDate: null,
      monthToDate: null,
      yearToDate: null,
      yesterday: null,
      lastWeek: null,
      lastMonth: null,
      "last-n-months": null,
      "last-n-days": null
    };
    this.setState({
      weekToDate: false,
      monthToDate: false,
      yearToDate: false,
      lastSevenDays: false,
      lastThirtyDays: false,
      lastTwelveMonths: false,
      yesterday: false,
      lastWeek: false,
      lastMonth: false,
      model: {}
    });
    FlowRouter.setQueryParams(appliedFilters);
    this.closeDialog();
  };

  render() {
    const {
      actionTypes,
      substates,
      model,
      weekToDate,
      monthToDate,
      yearToDate,
      lastSevenDays,
      lastThirtyDays,
      lastTwelveMonths,
      yesterday,
      lastWeek,
      lastMonth,
      userRoles,
      accountActions,
      isScrollLoading,
      dialogIsActive
    } = this.state;

    console.log(accountActions);

    return (
      <div className="action-block">
        <div className="header__block flex--helper ">
          <div className="title-block text-uppercase">Actions timeline</div>
          {accountActions.length ? (
            <button className="btn-filter__action" onClick={this.openDialog}>
              <i className="icon-filter" />
            </button>
          ) : null}

          {dialogIsActive && (
            <Dialog
              className="account-dialog filter-dialog"
              closePortal={this.closeDialog}
              title="Filter by:"
            >
              <button className="close-dialog" onClick={this.closeDialog}>
                <i className="icon-close" />
              </button>
              <AutoForm
                ref="filters"
                onSubmit={this.onSubmit}
                schema={schema}
                model={model}
              >
                <div className="filter-bar">
                  <div className="flex--helper form-group__pseudo m-t--10">
                    <div className="select-form">
                      <SelectField
                        label="Action:"
                        name="type"
                        options={actionTypes}
                        placeholder="Select action"
                      />
                    </div>
                    <div className="select-form">
                      <SelectField
                        label="Substate:"
                        placeholder="Select substate"
                        name="substate"
                        options={substates}
                      />
                    </div>
                  </div>
                  <div className="select-form">
                    <SelectField
                      name="role"
                      options={userRoles}
                      label="User:"
                      placeholder="Select user"
                    />
                  </div>
                  <div className="check-group">
                    <input checked={weekToDate} type="checkbox" />
                    <label
                      onClick={() =>
                        this.handleClick(filterTypeEnums.WEEK_TO_DATE)
                      }
                    >
                      Week to date
                    </label>
                  </div>
                  <div className="check-group">
                    <input checked={monthToDate} type="checkbox" />
                    <label
                      onClick={() =>
                        this.handleClick(filterTypeEnums.MONTH_TO_DATE)
                      }
                    >
                      Month to date
                    </label>
                  </div>
                  <div className="check-group">
                    <input checked={yearToDate} type="checkbox" />
                    <label
                      onClick={() =>
                        this.handleClick(filterTypeEnums.YEAR_TO_DATE)
                      }
                    >
                      Year to date
                    </label>
                  </div>
                  <div className="check-group">
                    <input checked={lastSevenDays} type="checkbox" />
                    <label
                      onClick={() =>
                        this.handleClick(filterTypeEnums.LAST_SEVEN_DAYS)
                      }
                    >
                      Last 7 days
                    </label>
                  </div>
                  <div className="check-group">
                    <input checked={lastThirtyDays} type="checkbox" />
                    <label
                      onClick={() =>
                        this.handleClick(filterTypeEnums.LAST_THIRTY_DAYS)
                      }
                    >
                      Last 30 days
                    </label>
                  </div>
                  <div className="check-group">
                    <input checked={lastTwelveMonths} type="checkbox" />
                    <label
                      onClick={() =>
                        this.handleClick(filterTypeEnums.LAST_TWELVE_MONTHS)
                      }
                    >
                      Last 12 months
                    </label>
                  </div>
                  <div className="check-group">
                    <input checked={yesterday} type="checkbox" />
                    <label
                      onClick={() =>
                        this.handleClick(filterTypeEnums.YESTERDAY)
                      }
                    >
                      Yesterday
                    </label>
                  </div>
                  <div className="check-group">
                    <input checked={lastWeek} type="checkbox" />
                    <label
                      onClick={() =>
                        this.handleClick(filterTypeEnums.LAST_WEEK)
                      }
                    >
                      Last Week
                    </label>
                  </div>
                  <div className="check-group">
                    <input checked={lastMonth} type="checkbox" />
                    <label
                      onClick={() =>
                        this.handleClick(filterTypeEnums.LAST_MONTH)
                      }
                    >
                      Last Month
                    </label>
                  </div>
                  <div className="flex--helper flex-justify--space-between">
                    <button className="btn--blue" onClick={this.closeDialog}>
                      Done
                    </button>
                    <button className="btn--red" onClick={this.resetFilters}>
                      Reset
                    </button>
                  </div>
                </div>
              </AutoForm>
            </Dialog>
          )}
        </div>
        <div
          ref="isScroll"
          className="timeline flex--helper flex-justify--center"
        >
          {accountActions.length ? (
            <div className="timeline-container">
              {accountActions.map((action, index) => {
                const { createdAt, type, user, account } = action;
                if (
                  (FlowRouter.getQueryParam("role") && !user) ||
                  (FlowRouter.getQueryParam("substate") && !account)
                ) {
                  return <div key={index} />;
                }

                return (
                  <TimelineItem
                    key={index}
                    icon={this.getTimelineIcon(type)}
                    createdAt={moment(createdAt).format(
                      "MMMM Do YYYY, hh:mm a"
                    )}
                  >
                    {this.getTimelineBody(action)}
                  </TimelineItem>
                );
              })}
            </div>
          ) : (
            <div className="m-t--10">No actions found</div>
          )}
        </div>
        {isScrollLoading && <Loading />}
      </div>
    );
  }
}

const schema = new SimpleSchema({
  type: {
    type: String,
    optional: true,
    label: "Search by Action type"
  },
  substate: {
    type: String,
    optional: true,
    label: "Search by Substate"
  },
  role: {
    type: String,
    optional: true,
    label: "Search by User role"
  }
});
