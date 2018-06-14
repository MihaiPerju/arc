import React, { Component } from "react";
import moment from "moment";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import { AutoForm, AutoField, SelectField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import { Timeline, TimelineEvent } from "react-event-timeline";
import query from "/imports/api/accounts/queries/accountList";
import Loading from "/imports/client/lib/ui/Loading";
import { typeList } from "/imports/api/accounts/enums/actionTypesEnum";
import substateQuery from "/imports/api/substates/queries/listSubstates";
import ClientService from "../../services/ClientService";
import { rolesTypes } from "/imports/api/clients/enums/contactTypes";

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
    if (key === "lastSevenDays") {
      FlowRouter.setQueryParams({ "last-n-days": flag ? 7 : null });
      this.setState({
        lastSevenDays: flag,
        lastThirtyDays: false,
        lastTwelveMonths: false
      });
    } else if (key === "lastThirtyDays") {
      FlowRouter.setQueryParams({ "last-n-days": flag ? 30 : null });
      this.setState({
        lastSevenDays: false,
        lastThirtyDays: flag,
        lastTwelveMonths: false
      });
    } else if (key === "lastTwelveMonths") {
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
    const {  isLoading, error } = this.props;
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
            <div className="title-block text-uppercase">actions</div>
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
                <div className="check-group">
                  <input checked={weekToDate} type="checkbox" />
                  <label onClick={() => this.handleClick("weekToDate")}>
                    Week to date
                  </label>
                </div>
                <div className="check-group">
                  <input checked={monthToDate} type="checkbox" />
                  <label onClick={() => this.handleClick("monthToDate")}>
                    Month to date
                  </label>
                </div>
                <div className="check-group">
                  <input checked={yearToDate} type="checkbox" />
                  <label onClick={() => this.handleClick("yearToDate")}>
                    Year to date
                  </label>
                </div>
                <div className="check-group">
                  <input checked={lastSevenDays} type="checkbox" />
                  <label onClick={() => this.handleClick("lastSevenDays")}>
                    Last 7 days
                  </label>
                </div>
                <div className="check-group">
                  <input checked={lastThirtyDays} type="checkbox" />
                  <label onClick={() => this.handleClick("lastThirtyDays")}>
                    Last 30 days
                  </label>
                </div>
                <div className="check-group">
                  <input checked={lastTwelveMonths} type="checkbox" />
                  <label onClick={() => this.handleClick("lastTwelveMonths")}>
                    Last 12 months
                  </label>
                </div>
                <div className="check-group">
                  <input checked={yesterday} type="checkbox" />
                  <label onClick={() => this.handleClick("yesterday")}>
                    Yesterday
                  </label>
                </div>
                <div className="check-group">
                  <input checked={lastWeek} type="checkbox" />
                  <label onClick={() => this.handleClick("lastWeek")}>
                    Last Week
                  </label>
                </div>
                <div className="check-group">
                  <input checked={lastMonth} type="checkbox" />
                  <label onClick={() => this.handleClick("lastMonth")}>
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
        <div className="main__block">
          {actionsPerformed.length > 0 && (
            <Timeline>
              {actionsPerformed &&
                actionsPerformed.map((actionPerformed, key) => (
                  <TimelineEvent
                    title={
                      actionPerformed.action && actionPerformed.action.title
                    }
                    createdAt={moment(
                      actionPerformed && actionPerformed.createdAt
                    ).format("MMMM Do YYYY, hh:mm a")}
                    icon={<i />}
                  >
                    Reason code: {actionPerformed.reasonCode}
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
