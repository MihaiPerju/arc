import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import moment from "moment";
import DashboardListItem from "../DashboardListItem";
import { ManagerWidgets } from "../../enums/widgetType";
import Loading from "../../../../lib/ui/Loading";
import CHART_TYPE from "../../enums/chartType";
import PieChart from "../PieChart";
import LineChart from "../LineChart";


export default class AssignedAccounts extends React.Component {


  state = {
    isLoadingAssignedAccounts: false,
    assignedAccounts: [],
    isLoadingAssignedAccountChart: false,
    assignedAccountsChartData: []
  };

  componentDidMount() {
    const { filters } = this.props;
    this.getAssignedAccounts(filters.selectedClientId, filters.selectedFacilityId, filters.selectedUserId);
    this.getAssignedAccountsChartData(filters.selectedClientId, filters.selectedFacilityId, filters.selectedUserId);
  }

  componentWillReceiveProps(props) {
    const { filters } = props;
    this.getAssignedAccounts(filters.selectedClientId, filters.selectedFacilityId, filters.selectedUserId);
    this.getAssignedAccountsChartData(filters.selectedClientId, filters.selectedFacilityId, filters.selectedUserId);
  }

  getAssignedAccounts(clientId, facilityId, userId) {
    this.setState({ isLoadingAssignedAccounts: true });
    setTimeout(() => {
      Meteor.call("accountsAssigned.get", clientId, facilityId, userId, (err, responseData) => {
        if (!err) {

          this.setState({ assignedAccounts: responseData, isLoadingAssignedAccounts: false });
        } else {
          this.setState({ isLoadingAssignedAccounts: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  getAssignedAccountsChartData(clientId, facilityId, userId) {
    this.setState({ isLoadingAssignedAccountChart: true });
    setTimeout(() => {
      Meteor.call("account.getAssignedPerHour", clientId, facilityId, userId, new Date(moment()), (err, chartData) => {
        if (!err) {
          this.setState({ assignedAccountsChartData: chartData, isLoadingAssignedAccountChart: false });
        } else {
          this.setState({ isLoadingAssignedAccountChart: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  renderAssignedAccounts() {
    const { isLoadingAssignedAccounts, assignedAccounts } = this.state;
    if (!isLoadingAssignedAccounts) {
      return (
        <div className={assignedAccounts.length > 0 ? '' : 'dashboard-content-center'}>
          {
            assignedAccounts.length > 0 ?
              assignedAccounts.map(account => {
                return <DashboardListItem key={account._id} data={account} type={ManagerWidgets.ASSIGNED_ACCOUNTS} />;
              })
              : <div className="dashboard-empty-content">
                No assigned accounts has been found.
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

  renderAssignedAccountsChart() {
    const { filters } = this.props;
    const { isLoadingAssignedAccountChart, assignedAccountsChartData } = this.state;

    let chartOptions = {
      xAxisTitle: 'Hours',
      yAxisTitle: 'Number of Accounts',
      title: 'Accounts',
      ySeries: 'Accounts per hour'
    };

    if (!isLoadingAssignedAccountChart) {
      if (filters.selectedChartType.type === CHART_TYPE.Pie) {
        return (
          <PieChart data={assignedAccountsChartData} chartOptions={chartOptions} />
        );
      }
      else if (filters.selectedChartType.type === CHART_TYPE.Line) {
        return (
          <LineChart data={assignedAccountsChartData} chartOptions={chartOptions} />
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
          <div className="dashboard-sub-title">Assigned Accounts</div>
        </div>
        <div className="dashboard-row content-height">
          <div className="dashboard-section">
            <div className="dashboard-section-content">
              {
                this.renderAssignedAccounts()
              }
            </div>
          </div>
          <div className="dashboard-section">
            <div className="dashboard-section-content m-l-5">
              {
                this.renderAssignedAccountsChart()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}