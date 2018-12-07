import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import DashboardListItem from "../DashboardListItem";
import { ManagerWidgets } from "../../enums/widgetType";
import Loading from "../../../../lib/ui/Loading";
import CHART_TYPE from "../../enums/chartType";
import PieChart from "../PieChart";
import LineChart from "../LineChart";
import FilterService from "../../services/FilterService";

export default class TurnTime extends React.Component {

  state = {
    isLoadingTurnTime: false,
    turnTimeValues: [],
    isLoadingTurnTimeChart: false,
    turnTimeValuesChartData: []
  };

  componentDidMount() {
    const { filters } = this.props;
    this.getTurnTimeValues(filters);
    this.getTurnTimeValuesChartData(filters);
  }

  componentWillReceiveProps(props) {
    const { filters } = props;
    this.getTurnTimeValues(filters);
    this.getTurnTimeValuesChartData(filters);
  }

  getTurnTimeValues(filters) {
    this.setState({ isLoadingTurnTime: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    setTimeout(() => {
      Meteor.call("clients.getStatistics", filters.selectedClientId, filters.selectedFacilityId, filters.selectedUserId, filterCondition, (err, responseData) => {
        if (!err) {
          this.setState({ turnTimeValues: responseData, isLoadingTurnTime: false });
        } else {
          this.setState({ isLoadingTurnTime: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  prepareChartData(clients) {
    var chartData = { xAxisValues: [], yAxisValues: [] };
    chartData.xAxisValues = clients.map(c => c.name);
    chartData.yAxisValues = clients.map(c => c.turnTimeValue);
    return chartData;
  }

  getTurnTimeValuesChartData(filters) {
    this.setState({ isLoadingTurnTimeChart: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    setTimeout(() => {
      Meteor.call("clients.getStatisticsChartData", filters.selectedClientId, filters.selectedFacilityId, filters.selectedUserId, filterCondition, (err, reponseData) => {
        if (!err) {
          var chartData = this.prepareChartData(reponseData);
          this.setState({ turnTimeValuesChartData: chartData, isLoadingTurnTimeChart: false });
        } else {
          this.setState({ isLoadingTurnTimeChart: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  renderTurnTimeValues() {
    const { isLoadingTurnTime, turnTimeValues } = this.state;
    if (!isLoadingTurnTime) {
      return (
        <div className={turnTimeValues.length > 0 ? '' : 'dashboard-content-center'}>
          {
            turnTimeValues.length > 0 ?
              turnTimeValues.map(account => {
                return <DashboardListItem key={account._id} data={account} type={ManagerWidgets.TURN_TIME} />;
              })
              : <div className="dashboard-empty-content">
                No turntime values has been found.
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

  renderTurnTimeValuesChart() {
    const { filters } = this.props;
    const { isLoadingTurnTimeChart, turnTimeValuesChartData } = this.state;

    let chartOptions = {
      xAxisTitle: 'Clients',
      yAxisTitle: 'Number of Turn Time',
      title: 'Turn Time',
      ySeries: 'Turn Time',
      widgetType: ManagerWidgets.TURN_TIME
    };

    if (!isLoadingTurnTimeChart) {
      if (filters.selectedChartType.type === CHART_TYPE.Pie) {
        return (
          <PieChart data={turnTimeValuesChartData} chartOptions={chartOptions} />
        );
      }
      else if (filters.selectedChartType.type === CHART_TYPE.Line) {
        return (
          <LineChart data={turnTimeValuesChartData} chartOptions={chartOptions} />
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
          <div className="dashboard-sub-title">TurnTime</div>
        </div>
        <div className="dashboard-row content-height">
          <div className="dashboard-section">
            <div className="dashboard-section-content">
              {
                this.renderTurnTimeValues()
              }
            </div>
          </div>
          <div className="dashboard-section">
            <div className="dashboard-section-content m-l-5">
              {
                this.renderTurnTimeValuesChart()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}