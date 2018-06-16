import React from "react";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/users/queries/singleUser";
import accountActionsQuery from "/imports/api/accountActions/queries/accountActionList";
import { Timeline, TimelineEvent } from "react-event-timeline";
import Loading from "/imports/client/lib/ui/Loading";
import MyAvatar from "./components/MyAvatar";
import moment from "moment";
import RolesEnum, { roleGroups } from "/imports/api/users/enums/roles";
import Security from "/imports/api/security/security.js";

class UserProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      accountActions: null,
      errorMessage: null
    };
  }

  componentWillMount() {
    const { userId } = FlowRouter.current().params;
    const currentUserId = Meteor.userId();
    const isRep = Roles.userIsInRole(userId, RolesEnum.REP);
    if (
      (isRep &&
        Roles.userIsInRole(currentUserId, roleGroups.ADMIN_TECH_MANAGER)) ||
      (isRep && currentUserId === userId)
    ) {
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
    } else {
      this.setState({ errorMessage: "You do not have the correct roles for this!" });
    }
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
    const { data, isLoading, error } = this.props;
    const { accountActions, errorMessage } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return <div>{error.reason}</div>;
    }

    if (errorMessage) {
      return <div>{errorMessage}</div>;
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
                  {data.profile
                    ? data.profile.firstName + " " + data.profile.lastName
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
                <div className="status">{data.emails[0].address}</div>
              </div>
              <div className="text-block">
                <div className="text-light-grey text-label">Phone number</div>
                <p>
                  {data.profile ? data.profile.phoneNumber : "No Phone Number"}
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

// export default createUserContainer(UserProfile);
export default withQuery(
  props => {
    const { userId } = FlowRouter.current().params;
    return query.clone({
      filters: {
        _id: userId
      }
    });
  },
  { reactive: true, single: true }
)(UserProfile);
