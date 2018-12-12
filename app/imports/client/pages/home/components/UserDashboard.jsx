import React from "react";
import Notifier from "../../../lib/Notifier";
import pages from "../../../../api/settings/enums/settings";
import Loading from "../../../lib/ui/Loading";

export default class UserDashboard extends React.Component {

  state = {
    widgetSettings: null,
    isLoading: true,
    userStatistics: undefined,
    isLoadingStatistics: false
  };

  componentWillMount() {
    this.getUserStatistics();
  }

  getWidgetSettings() {
    this.setState({ isLoading: true });
    Meteor.call("managerSettings.get", pages.WIDGET_SETTINGS, (err, responseData) => {
      if (!err) {
        this.setState({
          widgetSettings: responseData ? responseData.widgetSetting : undefined,
          isLoading: false
        });
      } else {
        this.setState({ isLoading: false });
        Notifier.error(err.reason);
      }
    });
  }

  getUserStatistics() {
    this.setState({ isLoadingStatistics: true });
    setTimeout(() => {
      Meteor.call("user.statistics.get", (err, responseData) => {
        if (!err) {
          this.setState({
            userStatistics: responseData ? responseData.statistics : undefined,
            isLoadingStatistics: false
          });
        } else {
          this.setState({ isLoadingStatistics: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  renderWidgets() {
    const { userStatistics } = this.state;
    if (userStatistics) {
      return (
        <div>
          <div className="stats-section">
            <div className="stats-section-item" style={{ width: '25%' }}>
              <div className="stats-content">
                <div className="stats-title" style={{ fontSize: '14px' }}>
                  <span className="stats-icon"><span className="menu__icon"><i className="icon-user"></i></span>
                  </span>Assigned To Me</div>
                <div className="stats-count" style={{ marginTop: '5px' }}>{userStatistics.assignedToMe}</div>
              </div>
              <span className="stats-left-border"></span>
            </div>
            <div className="stats-section-item" style={{ width: '25%' }}>
              <div className="stats-content">
                <div className="stats-title" style={{ fontSize: '14px' }}>
                  <span className="stats-icon"><span className="menu__icon"><i className="icon-hand-paper-o"></i></span>
                  </span>Completed Accounts</div>
                <div className="stats-count" style={{ marginTop: '5px' }}>{userStatistics.completedAccounts}</div>
              </div>
              <span className="stats-left-border"></span>
            </div>
            <div className="stats-section-item" style={{ width: '25%' }}>
              <div className="stats-content">
                <div className="stats-title" style={{ fontSize: '14px' }}>
                  <span className="stats-icon"><span className="menu__icon"><i className="icon-archive"></i></span>
                  </span>Closed Accounts</div>
                <div className="stats-count" style={{ marginTop: '5px' }}>{userStatistics.closedAccounts}</div>
              </div>
              <span className="stats-left-border"></span>
            </div>
            <div className="stats-section-item" style={{ width: '25%' }}>
              <div className="stats-content">
                <div className="stats-title" style={{ fontSize: '14px' }}>
                  <span className="stats-icon"><span className="menu__icon"><i className="icon-users"></i></span>
                  </span>Collected Today</div>
                <div className="stats-count" style={{ marginTop: '5px' }}>{userStatistics.collectedToday}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    const { isLoadingStatistics } = this.state;
    return (
      <div style={{ position: 'relative' }}>
        {
          !isLoadingStatistics ?
            this.renderWidgets() :
            <div className="dashboard-content-center">
              <Loading />
            </div>
        }
      </div>
    );
  }
}