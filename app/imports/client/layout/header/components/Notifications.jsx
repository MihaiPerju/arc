import React, { Component } from "react";
import classNames from "classnames";
import NotificationTypeEnum from "/imports/api/notifications/enums/notificationTypes";
import Loading from "/imports/client/lib/ui/Loading";
import flagTypesEnum from "/imports/api/accounts/enums/flagTypesEnum";
import moment from "moment";
import Notifier from "../../../lib/Notifier";

export default class Notitfications extends Component {
  constructor() {
    super();
    this.state = {
      dropdownIsActive: false,
      badge: true
    };
    this.pollingMetod = null;
  }

  componentWillMount() {
    this.pollingMethod = setInterval(() => {
      this.getNotifications();
    }, 3000);
  }

  getNotifications() {
    let filters = {
      receiverId: Meteor.userId(),
      type: { $ne: NotificationTypeEnum.GLOBAL }
    };
    Meteor.call("notifications.get", filters, (err, notifications) => {
      if (!err) {
        this.setState({ notifications });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  componentWillUnmount() {
    //Removing Interval
    clearInterval(this.pollingMethod);
  }

  openDropdown = () => {
    const { dropdownIsActive } = this.state;

    if (!dropdownIsActive) {
      document.addEventListener("click", this.outsideClick, false);
    } else {
      document.removeEventListener("click", this.outsideClick, false);
    }

    this.setState({
      dropdownIsActive: !dropdownIsActive,
      badge: false
    });
  };

  outsideClick = e => {
    if (this.node.contains(e.target)) {
      return;
    }

    this.openDropdown();
  };

  nodeRef = node => {
    this.node = node;
  };

  getMessage = notification => {
    const { metadata, type } = notification;
    if (
      metadata &&
      metadata.acctNum &&
      type === NotificationTypeEnum.RESPONSE
    ) {
      return (
        <div>
          Manager responded to account with Account Number{" "}
          <a
            className="text-blue"
            href={`/accounts/${metadata.state.toLowerCase()}?accountId=${
              metadata.accountId
            }`}
          >
            {metadata.acctNum}
          </a>
        </div>
      );
    } else if (
      metadata &&
      metadata.name &&
      type === NotificationTypeEnum.REPORT
    ) {
      return (
        <div>
          Report:
          <a
            className="text-blue"
            href={`/reports/list?reportId=${metadata.reportId}`}
          >
            {metadata.name}
          </a>
          has been completed
        </div>
      );
    } else if (
      metadata &&
      metadata.acctNum &&
      type === NotificationTypeEnum.FLAG
    ) {
      return (
        <div>
          <span>
            User flagged
            {metadata.flagType === flagTypesEnum.ACTION ? " an " : " a "}
            {metadata.flagType} on account with Account number
          </span>
          <a
            className="text-blue"
            href={`/accounts/${metadata.state.toLowerCase()}?accountId=${
              metadata.accountId
            }`}
          >
            {metadata.acctNum}
          </a>
        </div>
      );
    } else if (
      metadata &&
      metadata.acctNum &&
      type === NotificationTypeEnum.COMMENT
    ) {
      return (
        <div>
          <span>Note left by manager on account with Account number</span>
          <a
            className="text-blue"
            href={`/accounts/${metadata.state.toLowerCase()}?accountId=${
              metadata.accountId
            }`}
          >
            {metadata.acctNum}
          </a>
        </div>
      );
    }
    return notification.message;
  };

  render() {
    const { dropdownIsActive, badge, notifications } = this.state;

    const notificationBtnClasses = classNames("notification-btn", {
      active: dropdownIsActive
    });

    if (!notifications) {
      return <Loading />;
    }

    return (
      <div className="notification-dropdown">
        <a
          href="javascript:;"
          className={notificationBtnClasses}
          onClick={this.openDropdown}
          ref={this.nodeRef}
        >
          <i className="icon-bell-o" />
          {badge && notifications.length !== 0 && (
            <div className="badge text-center">{notifications.length}</div>
          )}
        </a>
        {dropdownIsActive && (
          <div className="notification-dropdown__container">
            <div className="notification-caret">
              <div className="notification-outer" />
              <div className="notification-inner" />
            </div>
            <div className="notification-dropdown__wrapper">
              {notifications.map((notification, index) => (
                <NotificationItem
                  key={index}
                  content={notification.content}
                  time={moment(notification.createdAt).format(
                    "MM/DD/YYYY, h:mm a"
                  )}
                >
                  {this.getMessage(notification)}
                </NotificationItem>
              ))}
              {notifications && notifications.length === 0 && (
                <div className="notification-none text-center text-light-grey">
                  No notifications!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

class NotificationItem extends Component {
  render() {
    const { time, children } = this.props;

    return (
      <div className="notification-row">
        <div className="notification-icon">
          <i className="icon-response" />
        </div>
        <div className="notification-info__content">
          <div className="notification-content text-light-grey">{children}</div>
          <div className="notification-time">{time}</div>
        </div>
      </div>
    );
  }
}
