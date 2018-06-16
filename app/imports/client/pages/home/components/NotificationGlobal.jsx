import React from "react";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import notificationQuery from "/imports/api/notifications/queries/notificationList";
import Notifier from "/imports/client/lib/Notifier";
import NotificationTypeEnum from "/imports/api/notifications/enums/notificationTypes";

const styles = {
  width: "100%",
  color: "white",
  "background-color": "black",
  height: "5rem",
  "text-align": "center",
  "font-size": "2rem"
};

class NotificationGlobalContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
  }

  onClick = () => {
    FlowRouter.go("/dashboard");
    this.onClose();
  };

  onClose() {
    this.setState({
      isOpen: false
    });
  }

  componentWillReceiveProps(props) {
    const { data } = props;
    if (data.length > 0) {
      Notifier.info("You have new notifications.");
      Meteor.call("notification.setAsSeen", data[0]._id);
    }
  }

  render() {
    return <div />;
  }
}

export default withQuery(
  props => {
    return notificationQuery.clone({
      filters: {
        receiverId: Meteor.userId(),
        seen: false,
        type: NotificationTypeEnum.GLOBAL
      }
    });
  },
  { reactive: true }
)(NotificationGlobalContainer);
