import React from "react";
import accountActionsQuery from "/imports/api/accountActions/queries/accountActionList";
import { Timeline, TimelineEvent } from "react-event-timeline";
import Loading from "/imports/client/lib/ui/Loading";
import MyAvatar from "./components/MyAvatar";
import moment from "moment";
import actionTypesEnum from "/imports/api/accounts/enums/actionTypesEnum";
import userListQuery from "/imports/api/users/queries/listUsers.js";

export default class UserProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      accountActions: null,
      user: null
    };
  }

  componentWillMount() {
    const { userId } = FlowRouter.current().params;
    accountActionsQuery
      .clone({
        filters: {
          userId
        }
      })
      .fetch((err, accountActions) => {
        if (!err) {
          this.setState({
            accountActions
          });
        }
      });

    userListQuery
      .clone({
        filters: {
          _id: userId
        }
      })
      .fetchOne((err, user) => {
        if (!err) {
          this.setState({
            user
          });
        }
      });
  }

  getTimelineIcon = type => {
    switch (type) {
      case actionTypesEnum.USER_ACTION:
        return <i className="icon-thumb-tack text-blue" />;
      case actionTypesEnum.SYSTEM_ACTION:
        return <i className="icon-alert" />;
      case actionTypesEnum.COMMENT:
        return <i className="icon-comments-o text-dark-grey" />;
      case actionTypesEnum.LETTER:
        return <i className="icon-inbox" />;
      case actionTypesEnum.FLAG:
        return <i className="icon-flag" />;
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
      manager
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
                Number <b>{acctNum}</b>
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
                Applied action <b>{action.title}</b> to account with Account
                Number <b>{acctNum}</b>
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
            <b>{acctNum}</b>
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
                <b>{acctNum}</b>
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
                flagged an action on account <b>{acctNum}</b>.
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
                flagged a comment on account <b>{acctNum}</b>.
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
      default:
        return "";
    }
  };

  render() {
    const { accountActions, user } = this.state;

    if (!user) {
      return <div />;
    }

    return (
      <div className="cc-container settings-container">
        <div style={{ width: "100%" }} className="main-content action-content">
          <div className="main-content__wrapper">
            <div className="intro-block text-center">
              <div className="intro-block__wrapper">
                <i className="icon-user" />
                <div className="text-light-grey">User name</div>
                {/* <MyAvatar user={user}/> */}
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
                <div className="status">
                  {user.emails && user.emails[0].address}
                </div>
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
          <Timeline>
            {accountActions &&
              accountActions.map((actionPerformed, index) => {
                const { createdAt, type } = actionPerformed;
                return (
                  <TimelineEvent
                    key={index}
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
