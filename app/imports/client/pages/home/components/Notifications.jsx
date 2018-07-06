import React from "react";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import NotificationQuery from "/imports/api/notifications/queries/notificationList";
import NotificationTypeEnum from "/imports/api/notifications/enums/notificationTypes";
import Loading from "/imports/client/lib/ui/Loading";
import Notifier from "/imports/client/lib/Notifier";
import { notificationColors } from "/imports/api/notifications/enums/notificationTypes";
import flagTypesEnum from "/imports/api/accounts/enums/flagTypesEnum";

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
    const { metaData, type } = notification;
    if (
      metaData &&
      metaData.acctNum &&
      type === NotificationTypeEnum.RESPONSE
    ) {
      return (
        "Manager responded to account with Account Number " +
        notification.metaData.acctNum
      );
    } else if (
      metaData &&
      metaData.acctNum &&
      type === NotificationTypeEnum.FLAG
    ) {
      return (
        <div>
          <span>
            User flagged{" "}
            {metaData.flagType === flagTypesEnum.ACTION ? "an" : "a"}{" "}
            {metaData.flagType} on account with Account number
          </span>
          <a
            className="text-blue"
            href={`/accounts/${metaData.state.toLowerCase()}?accountId=${
              metaData.accountId
            }`}
          >
            {metaData.acctNum}
          </a>
        </div>
      );
    }
    return notification.message;
  };

  render() {
    const { data, loading, error } = this.props;

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error.reason}</div>;
    }
    return (
      <div className="notification-list flex--helper flex-align--start">
        {data.map((notification, index) => (
          //To apply specific colors using enum from ...path/to/enum.js
          <div key={index} className="notification-item">
            <div className="notification-item__wrapper">
              <div className="notification-item__title text-light-grey">
                {this.getMessage(notification)}
              </div>
              <div className="notification-item__type">{notification.type}</div>
              <button onClick={this.onRemove.bind(this, notification._id)}>
                <i className="icon-close" />
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
    return NotificationQuery.clone({
      filters: {
        receiverId: Meteor.userId(),
        type: { $ne: NotificationTypeEnum.GLOBAL }
      }
    });
  },
  { reactive: true }
)(NotificationListContainer);
