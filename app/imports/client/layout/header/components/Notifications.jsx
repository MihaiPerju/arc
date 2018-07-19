import React, {Component} from 'react';
import classNames from 'classnames';

export default class Notitfications extends Component {
  constructor() {
    super();
    this.state = {
      dropdownIsActive: false,
      badge: true
    }
  }

  openDropdown = () => {
    const {dropdownIsActive} = this.state;

    if (!dropdownIsActive) {
      document.addEventListener("click", this.outsideClick, false);
    } else {
      document.removeEventListener("click", this.outsideClick, false);
    }

    this.setState({
      dropdownIsActive: !dropdownIsActive,
      badge: false
    })
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
    const { metaData, type } = notification;
    if (
      metaData &&
      metaData.acctNum &&
      type === NotificationTypeEnum.RESPONSE
    ) {
      return (
        "Manager responded to account with Account Number " + metaData.acctNum
      );
    } else if (
      metaData &&
      metaData.name &&
      type === NotificationTypeEnum.REPORT
    ) {
      return (
        <div>
          Report:
          <a href={`reports/list?reportId=${metaData.reportId}`}>
            {metaData.name}
          </a>
          has been completed
        </div>
      );
    } else if (
      metaData &&
      metaData.acctNum &&
      type === NotificationTypeEnum.FLAG
    ) {
      return (
        <div>
          <span>
            User flagged
            {metaData.flagType === flagTypesEnum.ACTION ? "an" : "a"}
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
    } else if (
      metaData &&
      metaData.acctNum &&
      type === NotificationTypeEnum.COMMENT
    ) {
      return (
        <div>
          <span>Note left by manager on account with Account number</span>
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
    const {dropdownIsActive, badge} = this.state;
    const {data} = this.props;
    const notificationBtnClasses = classNames('notification-btn', {
      'active': dropdownIsActive
    });

    //My Notifications
    const notifications = [
      {content: 'Manager responded to account with Account Number acnx1', time: '11:22'},
      {content: 'Manager responded to account with Account Number acnx1', time: '11:22'},
      {content: 'Manager responded to account with Account Number acnx1', time: '11:22'},
      {content: 'Manager responded to account with Account Number acnx1', time: '11:22'},
      {content: 'Manager responded to account with Account Number acnx1', time: '11:22'},
      {content: 'Manager responded to account with Account Number acnx1', time: '11:22'},
      {content: 'Manager responded to account with Account Number acnx1', time: '11:22'}
    ];

    return (
      <div className="notification-dropdown">
        <a href="javascript:;" className={notificationBtnClasses} onClick={this.openDropdown} ref={this.nodeRef}>
          <i className="icon-bell-o"/>
          {
            badge && notifications.length > 1 && (
              <div className="badge text-center">{notifications.length}</div>
            )
          }
        </a>
        {
          dropdownIsActive && (
            <div className="notification-dropdown__container">
              <div className="notification-caret">
                <div className="notification-outer"/>
                <div className="notification-inner"/>
              </div>
              <div className="notification-dropdown__wrapper">
                {
                  data.map((notification, index) => (
                    <NotificationItem key={index}
                                      content={notification.content}
                                      time={notification.time}
                    />
                  ))
                }
                {
                  notifications.length === 0 && (
                    <div className="notification-none text-center text-light-grey">No notifications!</div>
                  )
                }
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

class NotificationItem extends Component {
  render() {
    const {content, time} = this.props;

    return (
      <div className="notification-row">
        <div className="notification-icon">
          <i className="icon-response"/>
        </div>
        <div className="notification-info__content">
          <div className="notification-content text-light-grey">{content}</div>
          <div className="notification-time">{time}</div>
        </div>
      </div>
    )
  }
}