import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import DashboardListItem from "../DashboardListItem";
import { REP } from "../../enums/widgetType";
import Loading from "../../../../lib/ui/Loading";
import CHART_TYPE from "../../enums/chartType";
import PieChart from "../PieChart";
import LineChart from "../LineChart";
import FilterService from "../../services/FilterService";

export default class AssignedToMe extends React.Component {

  state = {
    isLoadingAssignedAccounts: false,
    assignedAccounts: [],
    isLoadingAssignedAccountChart: false,
    assignedAccountsChartData: []
  };

  componentDidMount() {
    const { filters } = this.props;
    this.getAssignedAccounts(filters);
    this.getAssignedAccountsChartData(filters);
  }

  componentWillReceiveProps(props) {
    const { filters } = props;
    this.getAssignedAccounts(filters);
    this.getAssignedAccountsChartData(filters);
  }

  getAssignedAccounts(filters) {
    this.setState({ isLoadingAssignedAccounts: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    setTimeout(() => {
      Meteor.call("accountsAssigned.get", filters.selectedClientId, filters.selectedFacilityId, Meteor.userId(), filterCondition, (err, responseData) => {
        if (!err) {
          this.setState({ assignedAccounts: responseData, isLoadingAssignedAccounts: false });
        } else {
          this.setState({ isLoadingAssignedAccounts: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  getAssignedAccountsChartData(filters) {
    this.setState({ isLoadingAssignedAccountChart: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    setTimeout(() => {
      Meteor.call("account.getAssignedPerHour", filters.selectedClientId, filters.selectedFacilityId, Meteor.userId(), filterCondition, (err, chartData) => {
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
                return <DashboardListItem key={account._id} data={account} type={REP.ASSIGNED_TO_ME} />;
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
      ySeries: 'Accounts per hour',
      
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
          <div className="dashboard-sub-title">Assigned To Me</div>
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