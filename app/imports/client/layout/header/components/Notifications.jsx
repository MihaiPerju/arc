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

  render() {
    const {dropdownIsActive, badge} = this.state;
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
            badge && (
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
                  notifications.map((notification, index) => (
                    <NotificationItem key={index}
                                      content={notification.content}
                                      time={notification.time}
                    />
                  ))
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
        <div className="notification-content text-light-grey">{content}</div>
        <div className="notification-time">{time}</div>
      </div>
    )
  }
}