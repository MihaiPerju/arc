import React from "react";
import classNames from "classnames";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import NotificationQuery from "/imports/api/notifications/queries/notificationList";
import Loading from "/imports/client/lib/ui/Loading";
import Notifier from "/imports/client/lib/Notifier";

class NotificationListContainer extends React.Component {
  constructor() {
    super();
  }

  onRemove(_id) {
    Meteor.call("notification.remove", _id, err => {
      if (err) {
        Notifier.error(err.reason);
      }
    });
  }

  getMessage = notification => {
    console.log(notification);
    return notification.message;
  };

  render() {
    const { data, loading, error } = this.props;

    const classes = classNames({
      "list-item": true,
      "user-item": true
    });

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error.reason}</div>;
    }
    return (
      <div className="notification-system__list flex--helper">
        {data.map(notification => (
          <div className="notification-system__item">
            <div className="">
              <div className="info">
                <div className="person-name">
                  {this.getMessage(notification)}
                </div>
                <div className="item-name text-blue">{notification.type}</div>
              </div>
              <button style={{ color: "black" }} onClick={this.onRemove.bind(this, notification._id)}>
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default withQuery(
  props => {
    return NotificationQuery.clone({ receiverId: Meteor.userId() });
  },
  { reactive: true }
)(NotificationListContainer);
