import React from "react";
import SimpleSchema from "simpl-schema";
import { Timeline, TimelineEvent } from "react-event-timeline";
import moment from "moment";
import UserService from "../../users/services/UserService";
import { AutoForm, SelectField } from "/imports/ui/forms";
import actionTypesEnum, {
  typeList,
  labels
} from "/imports/api/accounts/enums/actionTypesEnum";
import Loading from "/imports/client/lib/ui/Loading";
import ActivityGraph from "./ActivityGraph";


export default class RepDashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      accountActions: [],
      model: {},
      limit: 20,
      skip: 0,
      isScrollLoading: false
    };
  }

  componentWillMount() {
    const actionTypes = [];
    let { userId } = FlowRouter.current().params;
    userId = userId ? userId : Meteor.userId();
    const { limit, skip } = this.state;

    typeList.map(type => {
      if (!typeList.includes(["System Action"])) {
        actionTypes.push({ label: labels[type], value: type });
      }
    });
    this.getActions(userId, limit, skip);
    this.setState({ actionTypes });
  }

  componentDidMount() {
    const { isScroll } = this.refs;
    if (isScroll) {
      isScroll.addEventListener("scroll", () => { this.onHandleScroll(); });
    }
  }

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
    let { userId } = FlowRouter.current().params;
    userId = userId ? userId : Meteor.userId();
    skip = skip + limit;
    this.setState({ limit, skip });
    this.getActions(userId, limit, skip);
  };

  componentWillReceiveProps() {
    // set the limit to initial value
    this.setState({ limit: 20, skip: 0, accountActions: [] });
    let { userId } = FlowRouter.current().params;
    userId = userId ? userId : Meteor.userId();
    const { limit, skip } = this.state;

    this.getActions(userId, limit, skip);
  }

  getActions = (id, limit, skip) => {
    const params = UserService.getActionsQueryParams(id);
    _.extend(params, {
      options: { limit, skip, sort: { createdAt: -1 } }
    });
    Meteor.call("accountActions.get", params, (err, actions) => {
      if (!err) {
        let { accountActions } = this.state;
        accountActions = accountActions.concat(actions);
        this.setState({
          accountActions,
          isScrollLoading: false
        });
      }
    });
  };

  getTimelineIcon = type => {
    switch (type) {
      case actionTypesEnum.USER_ACTION:
        return <i className="icon-thumb-tack" />;
      case actionTypesEnum.COMMENT:
        return <i className="icon-comments-o" />;
      case actionTypesEnum.LETTER:
        return <i className="icon-inbox" />;
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
      acctNum,
      letterTemplate,
      user,
      actionId,
      isOpen,
      flagResponse,
      isFlagApproved,
      manager,
      account,
      fieldUpdatedValue,
      fieldPreviousValue,
      accountField
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
                applied action <b>{action.title}</b> to account with account
                number{" "}
                {account && (
                  <a
                    className="text-blue"
                    href={`/accounts/${account.state.toLowerCase()}?accountId=${
                      account._id
                      }`}
                  >
                    {account.acctNum}
                  </a>
                )}
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
                Applied action <b>{action.title}</b> to account with account
                number <b>{acctNum}</b>
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
            commented a comment <b>{content}</b> to account with account number{" "}
            {account && (
              <a
                className="text-blue"
                href={`/accounts/${account.state.toLowerCase()}?accountId=${
                  account._id
                  }`}
              >
                {account.acctNum}
              </a>
            )}
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
                {account && (
                  <a
                    className="text-blue"
                    href={`/accounts/${account.state.toLowerCase()}?accountId=${
                      account._id
                      }`}
                  >
                    {account.acctNum}
                  </a>
                )}
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
                flagged an action on account with account number{" "}
                {account && (
                  <a
                    className="text-blue"
                    href={`/accounts/${account.state.toLowerCase()}?accountId=${
                      account._id
                      }`}
                  >
                    {account.acctNum}
                  </a>
                )}
                {!isOpen && (
                  <div>
                    <br />
                    Manager{" "}
                    {manager && (
                      <b>
                        {manager.profile.firstName} {manager.profile.lastName}
                      </b>
                    )}{" "}
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
                  flagged a comment on account with account number{" "}
                  {account && (
                    <a
                      className="text-blue"
                      href={`/accounts/${account.state.toLowerCase()}?accountId=${
                        account._id
                        }`}
                    >
                      {account.acctNum}
                    </a>
                  )}
                  {!isOpen && (
                    <div>
                      <br />
                      Manager{" "}
                      {manager && (
                        <b>
                          {manager.profile.firstName} {manager.profile.lastName}
                        </b>
                      )}{" "}
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
            {account && (
              <a
                className="text-blue"
                href={`/accounts/${account.state.toLowerCase()}?accountId=${
                  account._id
                  }`}
              >
                {account.acctNum}
              </a>
            )}
          </div>
        );
      default:
        return "";
    }
  };

  onSubmit = params => {
    const { model } = this.state;
    if ("type" in params) {
      FlowRouter.setQueryParams({ type: params.type });
      model.type = params.type;
    }
    this.setState({ model });
  };

  render() {
    const {
      accountActions,
      model,
      actionTypes,
      isScrollLoading
    } = this.state;

    let userId = Meteor.userId();

    return (
      <div className="cc-container settings-container dashboard-container">
        <div className="graph-container">
          <ActivityGraph userId={userId} />
        </div>
        <div className="timeline-container">
          <div className="d-header">
            <div className="d-header-left">
              <h2>Activity Timeline</h2>
            </div>
            <div className="d-header-right" style={{ width: '30%' }}>
              <AutoForm
                autosave
                autosaveDelay={500}
                ref="filters"
                onSubmit={this.onSubmit}
                schema={schema}
                model={model} style={{ width: '100%' }}
              >

                <div className="select-wrapper full-width">
                  <div className="flex--helper form-group__pseudo full-width">
                    <div className="select-form full-width">
                      <SelectField
                        
                        name="type"
                        options={actionTypes}
                        placeholder="Select Action Type"
                      />
                    </div>
                  </div>
                </div>
              </AutoForm>
            </div>
          </div>
          <div ref="isScroll" className="m-t--10 content-height">
            <Timeline>
              {accountActions &&
                accountActions.map((actionPerformed, index) => {
                  const { createdAt, type } = actionPerformed;
                  return (
                    <TimelineEvent
                      key={index}
                      title=""
                      createdAt={moment(createdAt).format(
                        "MMMM Do YYYY, hh:mm a"
                      )}
                      icon={this.getTimelineIcon(type)}
                    >
                      {this.getTimelineBody(actionPerformed)}
                    </TimelineEvent>
                  );
                })}
            </Timeline>
            {isScrollLoading && <Loading />}
          </div>
        </div>

      </div>
    );
  }
}

const schema = new SimpleSchema({
  type: {
    type: String,
    optional: true,
    label: "Search by Action type"
  }
});