import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import DashboardListItem from "../DashboardListItem";
import { ManagerWidgets } from "../../enums/widgetType";
import Loading from "../../../../lib/ui/Loading";
import CHART_TYPE from "../../enums/chartType";
import PieChart from "../PieChart";
import LineChart from "../LineChart";
import FilterService from "../../services/FilterService";

export default class GeneratedReports extends React.Component {

  state = {
    isLoadingGeneratedReports: false,
    generatedReports: [],
    generatedReportsChartData: [],
    isLoadingGeneratedReportChart: false
  };

  componentDidMount() {
    const { filters } = this.props;
    this.getGeneratedReports(filters);
    this.getGeneratedReportsChartData(filters);
  }

  componentWillReceiveProps(props) {
    const { filters } = props;
    this.getGeneratedReports(filters);
    this.getGeneratedReportsChartData(filters);
  }

  getGeneratedReports(filters) {
    this.setState({ isLoadingGeneratedReports: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    setTimeout(() => {
      Meteor.call("reports.getGenerated", filterCondition, (err, responseData) => {
        if (!err) {
          this.setState({ isLoadingGeneratedReports: false, generatedReports: responseData });
        } else {
          this.setState({ isLoadingGeneratedReports: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  getGeneratedReportsChartData(filters) {
    this.setState({ isLoadingGeneratedReportChart: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    setTimeout(() => {
      Meteor.call("reports.getGeneratedPerHour", filterCondition, (err, chartData) => {
        if (!err) {
          this.setState({ generatedReportsChartData: chartData, isLoadingGeneratedReportChart: false });
        } else {
          this.setState({ isLoadingGeneratedReportChart: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  renderGeneratedReports() {
    const { isLoadingGeneratedReports, generatedReports } = this.state;
    if (!isLoadingGeneratedReports) {
      return (
        <div className={generatedReports.length > 0 ? '' : 'dashboard-content-center'}>
          {
            generatedReports.length > 0 ?
              generatedReports.map(report => {
                return <DashboardListItem key={report._id} data={report} type={ManagerWidgets.REPORTS_GENERATED} />;
              })
              : <div className="dashboard-empty-content">
                No generated reports has been found.
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

  renderGeneratedReportChart() {
    const { filters } = this.props;
    const { isLoadingGeneratedReportChart, generatedReportsChartData } = this.state;

    let chartOptions = {
      xAxisTitle: 'Hours',
      yAxisTitle: 'Number of reports',
      title: 'Generated Reports',
      ySeries: 'Reports Generated per hour',
      widgetType: ManagerWidgets.REPORTS_GENERATED
    };

    if (!isLoadingGeneratedReportChart) {
      if (filters.selectedChartType.type === CHART_TYPE.Pie) {
        return (
          <PieChart data={generatedReportsChartData} chartOptions={chartOptions} />
        );
      }
      else if (filters.selectedChartType.type === CHART_TYPE.Line) {
        return (
          <LineChart data={generatedReportsChartData} chartOptions={chartOptions} />
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
          <div className="dashboard-sub-title">Reports Generated</div>
        </div>
        <div className="dashboard-row content-height">
          <div className="dashboard-section">
            <div className="dashboard-section-content">
              {
                this.renderGeneratedReports()
              }
            </div>
          </div>
          <div className="dashboard-section">
            <div className="dashboard-section-content m-l-5">
              {
                this.renderGeneratedReportChart()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}