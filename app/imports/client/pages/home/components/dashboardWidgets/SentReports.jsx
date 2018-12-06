import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import DashboardListItem from "../DashboardListItem";
import { ManagerWidgets } from "../../enums/widgetType";
import Loading from "../../../../lib/ui/Loading";
import CHART_TYPE from "../../enums/chartType";
import PieChart from "../PieChart";
import LineChart from "../LineChart";
import FilterService from "../../services/FilterService";

export default class SentReports extends React.Component {

  state = {
    isLoadingSentReports: false,
    sentReports: [],
    sentReportsChartData: [],
    isLoadingSentReportsChart: false
  };

  componentDidMount() {
    const { filters } = this.props;
    this.getSentReports(filters);
    this.getSentReportsChartData(filters);
  }

  componentWillReceiveProps(props) {
    const { filters } = props;
    this.getSentReports(filters);
    this.getSentReportsChartData(filters);
  }

  getSentReports(filters) {
    this.setState({ isLoadingSentReports: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    setTimeout(() => {
      Meteor.call("reports.getSent", filters.selectedUserId, filterCondition, (err, responseData) => {
        if (!err) {
          this.setState({ isLoadingSentReports: false, sentReports: responseData });
        } else {
          this.setState({ isLoadingSentReports: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  getSentReportsChartData(filters) {
    this.setState({ isLoadingSentReportsChart: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    setTimeout(() => {
      Meteor.call("reports.getSentPerHour", filters.selectedUserId, filterCondition, (err, chartData) => {
        if (!err) {
          this.setState({ sentReportsChartData: chartData, isLoadingSentReportsChart: false });
        } else {
          this.setState({ isLoadingSentReportsChart: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  renderSentReports() {
    const { isLoadingSentReports, sentReports } = this.state;
    if (!isLoadingSentReports) {
      return (
        <div className={sentReports.length > 0 ? '' : 'dashboard-content-center'}>
          {
            sentReports.length > 0 ?
              sentReports.map(report => {
                return <DashboardListItem key={report._id} data={report} type={ManagerWidgets.REPORTS_SENT} />;
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

  renderSentReportChart() {
    const { filters } = this.props;
    const { isLoadingSentReportsChart, sentReportsChartData } = this.state;

    let chartOptions = {
      xAxisTitle: 'Hours',
      yAxisTitle: 'Number of reports',
      title: 'Sent Reports',
      ySeries: 'Reports Sent per hour'
    };

    if (!isLoadingSentReportsChart) {
      if (filters.selectedChartType.type === CHART_TYPE.Pie) {
        return (
          <PieChart data={sentReportsChartData} chartOptions={chartOptions} />
        );
      }
      else if (filters.selectedChartType.type === CHART_TYPE.Line) {
        return (
          <LineChart data={sentReportsChartData} chartOptions={chartOptions} />
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
          <div className="dashboard-sub-title">Reports Sent</div>
        </div>
        <div className="dashboard-row content-height">
          <div className="dashboard-section">
            <div className="dashboard-section-content">
              {
                this.renderSentReports()
              }
            </div>
          </div>
          <div className="dashboard-section">
            <div className="dashboard-section-content m-l-5">
              {
                this.renderSentReportChart()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}