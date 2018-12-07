import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import DashboardListItem from "../DashboardListItem";
import { ManagerWidgets } from "../../enums/widgetType";
import Loading from "../../../../lib/ui/Loading";
import CHART_TYPE from "../../enums/chartType";
import PieChart from "../PieChart";
import LineChart from "../LineChart";
import FilterService from "../../services/FilterService";

export default class NotificationWidget extends React.Component {

  state = {
    isLoadingNotifications: false,
    notifications: [],
    isLoadingNotificationsChart: false,
    notificationsChartData: []
  };

  componentDidMount() {
    const { filters } = this.props;
    this.getNotifications(filters);
    this.getNotificationsChartData(filters);
  }

  componentWillReceiveProps(props) {
    const { filters } = props;
    this.getNotifications(filters);
    this.getNotificationsChartData(filters);
  }

  getNotifications(filters) {
    this.setState({ isLoadingNotifications: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    setTimeout(() => {
      Meteor.call("notifications.get", filterCondition, (err, responseData) => {
        if (!err) {
          this.setState({ notifications: responseData, isLoadingNotifications: false });
        } else {
          this.setState({ isLoadingEscalationResolved: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  getNotificationsChartData(filters) {
    this.setState({ isLoadingNotificationsChart: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    setTimeout(() => {
      Meteor.call("notifications.getPerHour", filterCondition, (err, chartData) => {
        if (!err) {
          this.setState({ notificationsChartData: chartData, isLoadingNotificationsChart: false });
        } else {
          this.setState({ isLoadingNotificationsChart: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  renderNotifications() {
    const { isLoadingNotifications, notifications } = this.state;
    if (!isLoadingNotifications) {
      return (
        <div className={notifications.length > 0 ? '' : 'dashboard-content-center'}>
          {
            notifications.length > 0 ?
              notifications.map(notification => {
                return <DashboardListItem key={notification._id} data={notification} type={ManagerWidgets.NOTIFICATIONS} />;
              })
              : <div className="dashboard-empty-content">
                No notifications has been found.
            </div>
          }
        </div>
      );
    } else {
      return (
        <div className="dashboard-content-center">
          <Loading />
        </div>
      );
    }
  }

  renderNotificationsChart() {
    const { filters } = this.props;
    const { isLoadingNotificationsChart, notificationsChartData } = this.state;

    let chartOptions = {
      xAxisTitle: 'Hours',
      yAxisTitle: 'Number of Notifications',
      title: 'Notifications',
      ySeries: 'Notifications resolved per hour',
      widgetType: ManagerWidgets.NOTIFICATIONS
    };

    if (!isLoadingNotificationsChart) {
      if (filters.selectedChartType.type === CHART_TYPE.Pie) {
        return (
          <PieChart data={notificationsChartData} chartOptions={chartOptions} />
        );
      }
      else if (filters.selectedChartType.type === CHART_TYPE.Line) {
        return (
          <LineChart data={notificationsChartData} chartOptions={chartOptions} />
        );
      }
      else
        return null;
    } else {
      return (
        <div className="dashboard-content-center">
          <Loading />
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <div className="dashboard-row">
          <div className="dashboard-sub-title">Notifications</div>
        </div>
        <div className="dashboard-row content-height">
          <div className="dashboard-section">
            <div className="dashboard-section-content">
              {
                this.renderNotifications()
              }
            </div>
          </div>
          <div className="dashboard-section">
            <div className="dashboard-section-content m-l-5">
              {
                this.renderNotificationsChart()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}