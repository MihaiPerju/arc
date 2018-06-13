import React, { Component } from "react";
import moment from "moment";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import { AutoForm, AutoField, SelectField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import query from "/imports/api/accounts/queries/accountList";
import Loading from "/imports/client/lib/ui/Loading";
import { typeList } from "/imports/api/accounts/enums/actionTypesEnum";
import substateQuery from "/imports/api/substates/queries/listSubstates";
import ClientService from "../../services/ClientService";

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
      lastMonth: false
    };
  }

  componentWillMount() {
    const actionTypes = [];
    const substates = [];
    typeList.map(type => {
      actionTypes.push({ label: type, value: type });
    });
    this.setState({ actionTypes });

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
    this.setState({ model });
  };

  handleClick = key => {
    const flag = !this.state[key];
    if (key === "lastSevenDays") {
      FlowRouter.setQueryParams({ "last-n-days": flag ? 7 : null });
      this.setState({ lastSevenDays: flag, lastThirtyDays: false, lastTwelveMonths: false });
    } else if (key === "lastThirtyDays") {
      FlowRouter.setQueryParams({ "last-n-days": flag ? 30 : null });
      this.setState({ lastSevenDays: false, lastThirtyDays: flag, lastTwelveMonths: false });
    } else if (key === "lastTwelveMonths") {
      FlowRouter.setQueryParams({ "last-n-months": flag ? 12 : null });
      this.setState({ lastSevenDays: false, lastThirtyDays: false, lastTwelveMonths: flag });
    } else if (key) {
      FlowRouter.setQueryParams({ [key]: flag ? flag : null });
      this.setState({
        [key]: flag
      });
    }
  };

  render() {
    const { data, isLoading, error } = this.props;
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
      lastMonth
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
              </div>
            </div>
          </AutoForm>
        )}
        <div className="main__block">
          <div className="action-list">
            {actionsPerformed &&
              actionsPerformed.map((actionPerformed, key) => (
                <div className="action-item" key={key}>
                  <div className="action-info">
                    <div className="info">
                      {/* <div className="name">
                        {actionPerformed.accountInfo &&
                          actionPerformed.accountInfo.profile.firstName +
                            " " +
                            actionPerformed.accountInfo.profile.lastName}
                      </div> */}
                      <div className="text text-light-grey">
                        <b>{actionPerformed.reasonCode}</b>:
                        {actionPerformed.action && actionPerformed.action.title}
                      </div>
                    </div>
                    <div className="status archived">
                      {actionPerformed.action && actionPerformed.action.status}
                    </div>
                  </div>
                  <div className="action-time">
                    {moment(
                      actionPerformed && actionPerformed.createdAt
                    ).format("MMMM Do YYYY, hh:mm a")}
                  </div>
                  <div className="flag-item">
                    <input type="checkbox" id={key} className="hidden" />
                    <label htmlFor={key} />
                  </div>
                </div>
              ))}
          </div>
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
  }
});
