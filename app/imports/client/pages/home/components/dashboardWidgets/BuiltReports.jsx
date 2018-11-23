import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import DashboardListItem from "../DashboardListItem";
import { ManagerWidgets } from "../../enums/widgetType";
import Loading from "../../../../lib/ui/Loading";
import CHART_TYPE from "../../enums/chartType";
import PieChart from "../PieChart";
import LineChart from "../LineChart";
import FilterService from "../../services/FilterService";

export default class ReportsBuilt extends React.Component {

  state = {
    isLoadingReportsBuilt: false,
    builtReports: [],
    reportsBuiltChartData: [],
    isLoadingReportsBuiltChart: false
  };

  componentDidMount() {
    const { filters } = this.props;
    this.getBuiltReports(filters);
    this.getBuiltReportsChartData(filters);
  }

  componentWillReceiveProps(props) {
    const { filters } = props;
    this.getBuiltReports(filters);
    this.getBuiltReportsChartData(filters);
  }

  getBuiltReports(filters) {
    this.setState({ isLoadingBuiltReports: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    setTimeout(() => {
      Meteor.call("reports.getbuilt", filters.selectedUserId, filterCondition, (err, responseData) => {
        if (!err) {
          this.setState({ isLoadingBuiltReports: false, builtReports: responseData });
        } else {
          this.setState({ isLoadingBuiltReports: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  getBuiltReportsChartData(filters) {
    this.setState({ isLoadingReportsBuiltChart: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    setTimeout(() => {
      Meteor.call("reports.getBuiltPerHour", filters.selectedUserId, filterCondition, (err, chartData) => {
        if (!err) {
          this.setState({ reportsBuiltChartData: chartData, isLoadingReportsBuiltChart: false });
        } else {
          this.setState({ isLoadingReportsBuiltChart: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  renderReportsBuiltChart() {
    const { filters } = this.props;
    const { isLoadingReportsBuiltChart, reportsBuiltChartData } = this.state;

    let chartOptions = {
      xAxisTitle: 'Hours',
      yAxisTitle: 'Number of reports',
      title: 'Built Reports',
      ySeries: 'Reports Built per hour'
    };

    if (!isLoadingReportsBuiltChart) {
      if (filters.selectedChartType.type === CHART_TYPE.Pie) {
        return (
          <PieChart data={reportsBuiltChartData} chartOptions={chartOptions} />
        );
      }
      else if (filters.selectedChartType.type === CHART_TYPE.Line) {
        return (
          <LineChart data={reportsBuiltChartData} chartOptions={chartOptions} />
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

  renderReportsBuilt() {
    const { isLoadingAssignedAccounts, builtReports } = this.state;
    if (!isLoadingAssignedAccounts) {
      return (
        <div className={builtReports.length > 0 ? '' : 'dashboard-content-center'}>
          {
            builtReports.length > 0 ?
              builtReports.map(report => {
                return <DashboardListItem key={report._id} data={report} type={ManagerWidgets.REPORTS_BUILT} />;
              })
              : <div className="dashboard-empty-content">
                No reports has been found.
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

  render() {
    return (
      <div>
        <div className="dashboard-row">
          <div className="dashboard-sub-title">Reports Built</div>
        </div>
        <div className="dashboard-row content-height">
          <div className="dashboard-section">
            <div className="dashboard-section-content">
              {
                this.renderReportsBuilt()
              }
            </div>
          </div>
          <div className="dashboard-section">
            <div className="dashboard-section-content m-l-5">
              {
                this.renderReportsBuiltChart()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}