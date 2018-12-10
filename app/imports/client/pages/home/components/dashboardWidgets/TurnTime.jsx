import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import DashboardListItem from "../DashboardListItem";
import { ManagerWidgets } from "../../enums/widgetType";
import Loading from "../../../../lib/ui/Loading";
import FilterService from "../../services/FilterService";
import BarChart from "../BarChart";

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
    const { isLoadingTurnTimeChart, turnTimeValuesChartData } = this.state;
    let chartOptions = {
      xAxisTitle: 'Clients',
      yAxisTitle: 'Turn Time Percentage',
      title: 'Turn Time',
      ySeries: 'Turn Time',
      widgetType: ManagerWidgets.TURN_TIME
    };
   
    if (!isLoadingTurnTimeChart) {
      return (
        <BarChart data={turnTimeValuesChartData} chartOptions={chartOptions} />
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
        <div className="small-widget">
          <div className="small-widget-header">
            <div className="small-widget-title">TurnTime</div>
          </div>
          <div className="small-widget-content">
            {this.renderTurnTimeValues()}
          </div>
        </div>
        <div className="chart-widget">
          <div className="chart-widget-content">
            {
              this.renderTurnTimeValuesChart()
            }
          </div>
        </div>
      </div>
    );
  }
}