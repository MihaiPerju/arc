import React from "react";
import accountActionsQuery from "/imports/api/accountActions/queries/accountActionList";
import { Timeline, TimelineEvent } from "react-event-timeline";
import Loading from "/imports/client/lib/ui/Loading";
import MyAvatar from "./components/MyAvatar";
import moment from "moment";
import RolesEnum from "/imports/api/users/enums/roles";

export default class UserProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      accountActions: null
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
  }

  getTimelineIcon = type => {
    switch (type) {
      case "userAction":
        return <i className="icon-thumb-tack text-blue" />;
      case "systemAction":
        return <i className="icon-alert" />;
      case "comment":
        return <i className="icon-comments-o text-dark-grey" />;
      case "letter":
        return <i className="icon-inbox" />;
    }
  };

  render() {
    const { userId } = FlowRouter.current().params;
    const user = Meteor.users.findOne(userId);
    const { accountActions, errorMessage } = this.state;

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
                const { action, content, createdAt, type } = actionPerformed;
                return (
                  <TimelineEvent
                    key={index}
                    title={action && action.title}
                    createdAt={moment(createdAt).format(
                      "MMMM Do YYYY, hh:mm a"
                    )}
                    icon={this.getTimelineIcon(type)}
                  >
                    {action && action.description}
                    {content && content}
                  </TimelineEvent>
                );
              })}
          </Timeline>
        </div>
      </div>
    );
  }
}
