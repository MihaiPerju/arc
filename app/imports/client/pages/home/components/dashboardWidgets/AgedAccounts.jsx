import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import DashboardListItem from "../DashboardListItem";
import { ManagerWidgets } from "../../enums/widgetType";
import Loading from "../../../../lib/ui/Loading";
import CHART_TYPE from "../../enums/chartType";
import PieChart from "../PieChart";
import LineChart from "../LineChart";
import FilterService from "../../services/FilterService";
import BarChart from "../BarChart";

export default class AgedAccounts extends React.Component {

  state = {
    isLoadingAgedAccounts: false,
    agedAccounts: [],
    isLoadingAgedAccountChart: false,
    agedAccountsChartData: []
  };

  componentDidMount() {
    const { filters } = this.props;
    this.getAgedAccounts(filters);
    this.getAgedAccountsChartData(filters);
  }

  componentWillReceiveProps(props) {
    const { filters } = props;
    this.getAgedAccounts(filters);
    this.getAgedAccountsChartData(filters);
  }

  getAgedAccounts(filters) {
    this.setState({ isLoadingAgedAccounts: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    setTimeout(() => {
      Meteor.call("clients.getStatistics", filters.selectedClientId, filters.selectedFacilityId, filters.selectedUserId, filterCondition, (err, responseData) => {
        if (!err) {
          this.setState({ agedAccounts: responseData, isLoadingAgedAccounts: false });
        } else {
          this.setState({ isLoadingAgedAccounts: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  prepareChartData(clients) {
    var chartData = { xAxisValues: [], yAxisValues: [] };
    chartData.xAxisValues = clients.map(c => c.name);
    chartData.yAxisValues = clients.map(c => c.agedAccountsPercentage);
    return chartData;
  }

  getAgedAccountsChartData(filters) {
    this.setState({ isLoadingAgedAccountChart: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    setTimeout(() => {
      Meteor.call("clients.getStatisticsChartData", filters.selectedClientId, filters.selectedFacilityId, filters.selectedUserId, filterCondition, (err, reponseData) => {
        if (!err) {
          var chartData = this.prepareChartData(reponseData);
          this.setState({ agedAccountsChartData: chartData, isLoadingAgedAccountChart: false });
        } else {
          this.setState({ isLoadingAgedAccountChart: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  renderAgedAccounts() {
    const { isLoadingAgedAccounts, agedAccounts } = this.state;
    if (!isLoadingAgedAccounts) {
      return (
        <div className={agedAccounts.length > 0 ? '' : 'dashboard-content-center'}>
          {
            agedAccounts.length > 0 ?
              agedAccounts.map(account => {
                return <DashboardListItem key={account._id} data={account} type={ManagerWidgets.AGED_ACCOUNTS} />;
              })
              : <div className="dashboard-empty-content">
                No aged accounts has been found.
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

  renderAgedAccountsChart() {
    const { isLoadingAgedAccountChart, agedAccountsChartData } = this.state;

    let chartOptions = {
      xAxisTitle: 'Clients',
      yAxisTitle: 'Over 180 Percentage',
      title: 'Accounts',
      ySeries: 'Aged Accounts',
      widgetType: ManagerWidgets.AGED_ACCOUNTS
    };

    if (!isLoadingAgedAccountChart) {
      return (
        <BarChart data={agedAccountsChartData} chartOptions={chartOptions} />
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
        <div> <div className="small-widget">
          <div className="small-widget-header">
            <div className="small-widget-title">Aged Accounts</div>
          </div>
          <div className="small-widget-content">
            {this.renderAgedAccounts()}
          </div>
        </div>
          <div className="chart-widget">
            <div className="chart-widget-content">
              {
                this.renderAgedAccountsChart()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

}