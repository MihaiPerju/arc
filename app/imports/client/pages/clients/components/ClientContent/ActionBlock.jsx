import React, { Component } from "react";
import moment from "moment";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import { AutoForm, SelectField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import { Timeline, TimelineEvent } from "react-event-timeline";
import query from "/imports/api/accounts/queries/accountList";
import Loading from "/imports/client/lib/ui/Loading";
import { typeList } from "/imports/api/accounts/enums/actionTypesEnum";
import substateQuery from "/imports/api/substates/queries/listSubstates";
import ClientService from "../../services/ClientService";
import { rolesTypes } from "/imports/api/clients/enums/contactTypes";
import filterTypeEnums from "../../enums/filterTypes";

class ActionBlock extends Component {
  constructor() {
    super();
    this.state = {
      actions: [],
      filter: false,
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
      userRoles: []
    };
  }

  componentWillMount() {
    const actionTypes = [];
    const substates = [];
    const userRoles = [];
    typeList.map(type => {
      actionTypes.push({ label: type, value: type });
    });
    this.setState({ actionTypes });

    rolesTypes.map(type => {
      userRoles.push({ label: type, value: type });
    });
    this.setState({ userRoles });

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
  }

  getActions = () => {
    const { data } = this.props;
    let actions = [];
    data.map(account => {
      if (account.actions.length > 0) {
        account.actions.map(action => (action.acctNum = account.acctNum));
        actions = actions.concat(account.actions);
      }
    });
    return actions;
  };

  manageFilterBar = () => {
    const { filter } = this.state;
    this.setState({
      filter: !filter
    });
  };

  onSubmit = params => {
    const { model } = this.state;
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
    this.setState({ model });
  };

  handleClick = key => {
    const flag = !this.state[key];
    if (key === filterTypeEnums.LAST_SEVEN_DAYS) {
      FlowRouter.setQueryParams({ "last-n-days": flag ? 7 : null });
      this.setState({
        lastSevenDays: flag,
        lastThirtyDays: false,
        lastTwelveMonths: false
      });
    } else if (key === filterTypeEnums.LAST_THIRTY_DAYS) {
      FlowRouter.setQueryParams({ "last-n-days": flag ? 30 : null });
      this.setState({
        lastSevenDays: false,
        lastThirtyDays: flag,
        lastTwelveMonths: false
      });
    } else if (key === filterTypeEnums.LAST_TWELVE_MONTHS) {
      FlowRouter.setQueryParams({ "last-n-months": flag ? 12 : null });
      this.setState({
        lastSevenDays: false,
        lastThirtyDays: false,
        lastTwelveMonths: flag
      });
    } else if (key) {
      FlowRouter.setQueryParams({ [key]: flag ? flag : null });
      this.setState({
        [key]: flag
      });
    }
  };

  render() {
    const { isLoading, error } = this.props;
    const {
      filter,
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
      userRoles
    } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return <div>{error.reason}</div>;
    }

    const actionsPerformed = this.getActions();

    return (
      <div className="action-block">
        <div className="header__block">
          <div className="actions_filter__bar">
            <div className="title-block text-uppercase">Actions timeline</div>
            <div
              className={filter ? "filter-block active" : "filter-block"}
              onClick={this.manageFilterBar}
            >
              <button>
                <i className="icon-filter" />
              </button>
            </div>
          </div>
        </div>
        {filter && (
          <AutoForm
            autosave
            autosaveDelay={500}
            ref="filters"
            onSubmit={this.onSubmit}
            schema={schema}
            model={model}
          >
            <div className="filter-bar">
              <div className="select-wrapper">
                <div className="flex--helper form-group__pseudo">
                  <div className="select-form">
                    <SelectField
                      labelHidden={true}
                      name="type"
                      options={actionTypes}
                    />
                  </div>
                  <div className="select-form">
                    <SelectField
                      labelHidden={true}
                      name="substate"
                      options={substates}
                    />
                  </div>
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
                    onClick={() => this.handleClick(filterTypeEnums.YESTERDAY)}
                  >
                    Yesterday
                  </label>
                </div>
                <div className="check-group">
                  <input checked={lastWeek} type="checkbox" />
                  <label
                    onClick={() => this.handleClick(filterTypeEnums.LAST_WEEK)}
                  >
                    Last Week
                  </label>
                </div>
                <div className="check-group">
                  <input checked={lastMonth} type="checkbox" />
                  <label
                    onClick={() => this.handleClick(filterTypeEnums.LAST_MONTH)}
                  >
                    Last Month
                  </label>
                </div>
                <div className="select-form">
                  <SelectField
                    labelHidden={true}
                    name="role"
                    options={userRoles}
                  />
                </div>
              </div>
            </div>
          </AutoForm>
        )}
        <div className="actions__timeline">
          {actionsPerformed.length > 0 && (
            <Timeline>
              {actionsPerformed &&
                actionsPerformed.map((actionPerformed, index) => (
                  <TimelineEvent
                    title={actionPerformed.acctNum}
                    createdAt={moment(
                      actionPerformed && actionPerformed.createdAt
                    ).format("MMMM Do YYYY, hh:mm a")}
                    icon={<i className="icon-thumb-tack" />}
                    iconColor="#3cb878"
                    key={index}
                  >
                    <div>
                      {actionPerformed.action && actionPerformed.action.title}
                      {actionPerformed.reasonCode && (
                        <div>Reason code: {actionPerformed.reasonCode}</div>
                      )}
                    </div>
                  </TimelineEvent>
                ))}
            </Timeline>
          )}
        </div>
      </div>
    );
  }
}

export default withQuery(
  props => {
    const { _id } = props.client;
    const params = ClientService.getActionsQueryParams(_id);
    return query.clone(params);
  },
  { reactive: true }
)(ActionBlock);

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
