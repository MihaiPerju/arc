import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import moment from "moment";
import DashboardListItem from "../DashboardListItem";
import { ManagerWidgets } from "../../enums/widgetType";
import Loading from "../../../../lib/ui/Loading";
import CHART_TYPE from "../../enums/chartType";
import PieChart from "../PieChart";
import LineChart from "../LineChart";


export default class NotificationWidget extends React.Component {

  state = {
    isLoadingNotifications: false,
    notifications: [],
    isLoadingNotificationsChart: false,
    notificationsChartData: []
  };

  componentDidMount() {
    const { filters } = this.props;
    this.getNotifications(filters.selectedClientId, filters.selectedFacilityId);
    this.getEscalationResolvedChartData(filters.selectedClientId, filters.selectedFacilityId);
  }

  componentWillReceiveProps(props) {
    const { filters } = props;
    this.getNotifications(filters.selectedClientId, filters.selectedFacilityId);
    this.getEscalationResolvedChartData(filters.selectedClientId, filters.selectedFacilityId);
  }

  getNotifications() {
    this.setState({ isLoadingNotifications: true });
    setTimeout(() => {
      Meteor.call("notifications.get", (err, responseData) => {
        if (!err) {
          this.setState({ notifications: responseData, isLoadingNotifications: false });
        } else {
          this.setState({ isLoadingEscalationResolved: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  getEscalationResolvedChartData(clientId, facilityId) {
    this.setState({ isLoadingEscalationResolvedChart: true });
    setTimeout(() => {
      Meteor.call("escalationResolved.getPerHour", clientId, facilityId, new Date(moment()), (err, chartData) => {
        if (!err) {
          this.setState({ escalationResolvedChartData: chartData, isLoadingEscalationResolvedChart: false });
        } else {
          this.setState({ isLoadingEscalationResolvedChart: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
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
                this.renderEscalationResolved()
              }
            </div>
          </div>
          <div className="dashboard-section">
            <div className="dashboard-section-content m-l-5">
              {
                this.renderEscalationResolvedChart()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}