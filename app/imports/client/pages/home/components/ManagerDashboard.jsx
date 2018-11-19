import React from "react";
import Loading from "../../../../client/lib/ui/Loading";
import { ManagerWidgets } from '../enums/widgetType';
import DashboardListItem from "./DashboardListItem";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import CHART_TYPE from "../enums/chartType";

export default class ManagerDashboard extends React.Component {


  renderAssignedAccounts() {
    const { data } = this.props;
    if (!data.isLoadingAssignedAccounts) {
      return (
        <div className={data.assignedAccounts.length > 0 ? '' : 'dashboard-content-center'}>
          {
            data.assignedAccounts.length > 0 ?
              data.assignedAccounts.map(account => {
                return <DashboardListItem key={data._id} data={account} type={ManagerWidgets.ASSIGNED_ACCOUNTS} />;
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

  renderArchivedAccounts() {
    const { data } = this.props;
    if (!data.isLoadingArchivedAccounts) {
      return (
        <div className={data.archivedAccounts.length > 0 ? '' : 'dashboard-content-center'}>
          {
            data.archivedAccounts.length > 0 ?
              data.archivedAccounts.map(account => {
                return <DashboardListItem key={data._id} data={account} type={ManagerWidgets.ARCHIVED_ACCOUNTS} />;
              })
              : <div className="dashboard-empty-content">
                No archived accounts has been found.
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
    const { data, chartType } = this.props;

    let chartOptions = {
      xAxisTitle: 'Hours',
      yAxisTitle: 'Number of Accounts',
      title: 'Accounts',
      ySeries: 'Accounts per hour'
    };

    if (!data.isLoadingLineGraph) {
      if (chartType === CHART_TYPE.Pie) {
        return (
          <PieChart data={data} chartOptions={chartOptions} />
        );
      }
      else if (chartType === CHART_TYPE.Line) {
        return (
          <LineChart data={data} chartOptions={chartOptions} />
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
        <div className="dashboard-row">
          <div className="dashboard-sub-title">Archived Accounts</div>
        </div>
        <div className="dashboard-row content-height">
          <div className="dashboard-section">
            <div className="dashboard-section-content">
              {
                this.renderArchivedAccounts()
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