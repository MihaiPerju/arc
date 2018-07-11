import React from "react";
import { Loading } from "/imports/client/utils";
import SimpleSchema from "simpl-schema";
import createUserContainer from "/imports/client/lib/createUserContainer";
import { Timeline, TimelineEvent } from "react-event-timeline";
import moment from "moment";
import accountActionsQuery from "/imports/api/accountActions/queries/accountActionList";
import UserService from "./services/UserService";
import { AutoForm, SelectField } from "/imports/ui/forms";
import actionTypesEnum, {
  typeList
} from "/imports/api/accounts/enums/actionTypesEnum";

class MyProfile extends React.Component {
  constructor() {
    super();

    this.state = {
      accountActions: [],
      filter: false,
      model: {}
    };
  }

  componentWillMount() {
    const actionTypes = [];
    this.getActions();
    typeList.map(type => {
      actionTypes.push({ label: type, value: type });
    });
    this.setState({ actionTypes });
  }

  componentWillReceiveProps(props) {
    this.getActions();
  }

  manageFilterBar = () => {
    const { filter } = this.state;
    this.setState({
      filter: !filter
    });
  };

  getActions = () => {
    const params = UserService.getActionsQueryParams(Meteor.userId());
    accountActionsQuery.clone(params).fetch((err, accountActions) => {
      if (!err) {
        this.setState({
          accountActions
        });
      }
    });
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
      case actionTypesEnum.FLAG:
        return <i className="icon-flag" />;
      case actionTypesEnum.FILE:
        return <i className="icon-file-text-o" />;
      case actionTypesEnum.REVERT:
        return <i className="icon-file-text-o" />;
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
      fileName,
      account
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
                    {" "}
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
                {" "}
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
                    {" "}
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
                    {" "}
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
                    {" "}
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
                uploaded file <b>{this.getFileName(fileName)}.csv</b>
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
                reverted file <b>{this.getFileName(fileName)}.csv</b>
              </div>
            )}
          </div>
        );
      default:
        return "";
    }
  };

  getFileName = name => {
    return name.split(".")[0] || "";
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
    const { user } = this.props;
    const { accountActions, filter, actionTypes, model } = this.state;

    if (!user) {
      return <Loading />;
    }

    return (
      <div className="cc-container settings-container">
        <div style={{ width: "100%" }} className="main-content action-content">
          <div className="main-content__wrapper">
            <div className="intro-block text-center">
              <div className="intro-block__wrapper">
                <i className="icon-user" />
                <div className="text-light-grey">User name</div>
                <div className="action-name">
                  {user.profile
                    ? user.profile.firstName + " " + user.profile.lastName
                    : "No username"}
                </div>
              </div>
            </div>
            <div
              style={{ display: "table", margin: "0 auto" }}
              className="info-block"
            >
              <div className="text-block">
                <div className="text-light-grey text-label">Email</div>
                <div className="status">{user.getEmail()}</div>
              </div>
              <div className="text-block">
                <div className="text-light-grey text-label">Phone number</div>
                <p>
                  {user.profile ? user.profile.phoneNumber : "No Phone Number"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: "95%", width: "200%", overflowY: "scroll" }}>
          <div className="header__block">
            <div className="actions_filter__bar">
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
                  </div>
                </div>
              </div>
            </AutoForm>
          )}
          <Timeline>
            {accountActions &&
              accountActions.map((actionPerformed, index) => {
                const { createdAt, type } = actionPerformed;
                return (
                  <TimelineEvent
                    key={index}
                    title={""}
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
        </div>
      </div>
    );
  }
}

export default createUserContainer(MyProfile);

const schema = new SimpleSchema({
  type: {
    type: String,
    optional: true,
    label: "Search by Action type"
  }
});
