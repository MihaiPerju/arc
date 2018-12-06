import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import DashboardListItem from "../DashboardListItem";
import { ManagerWidgets } from "../../enums/widgetType";
import Loading from "../../../../lib/ui/Loading";
import CHART_TYPE from "../../enums/chartType";
import PieChart from "../PieChart";
import LineChart from "../LineChart";
import FilterService from "../../services/FilterService";

export default class PushToCall extends React.Component {

  state = {
    isLoadingPushToCall: false,
    numberOfAccounts: [],
    isLoadingPushToCallChart: false,
    numberOfAccountsChartData: []
  };

  componentDidMount() {
    const { filters } = this.props;
    this.getPushToCallAccounts(filters);
    this.getPushToCallAccountsChartData(filters);
  }

  componentWillReceiveProps(props) {
    const { filters } = props;
    this.getPushToCallAccounts(filters);
    this.getPushToCallAccountsChartData(filters);
  }

  getPushToCallAccounts(filters) {
    this.setState({ isLoadingPushToCall: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    setTimeout(() => {
      Meteor.call("clients.getStatistics", filters.selectedClientId, filters.selectedFacilityId, filters.selectedUserId, filterCondition, (err, responseData) => {
        if (!err) {
          this.setState({ numberOfAccounts: responseData, isLoadingPushToCall: false });
        } else {
          this.setState({ isLoadingPushToCall: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  prepareChartData(clients) {
    var chartData = { xAxisValues: [], yAxisValues: [] };
    chartData.xAxisValues = clients.map(c => c.name);
    chartData.yAxisValues = clients.map(c => c.callActionsPercentage);
    return chartData;
  }

  getPushToCallAccountsChartData(filters) {
    this.setState({ isLoadingPushToCallChart: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    setTimeout(() => {
      Meteor.call("clients.getStatisticsChartData", filters.selectedClientId, filters.selectedFacilityId, filters.selectedUserId, filterCondition, (err, reponseData) => {
        if (!err) {
          var chartData = this.prepareChartData(reponseData);
          this.setState({ numberOfAccountsChartData: chartData, isLoadingPushToCallChart: false });
        } else {
          this.setState({ isLoadingPushToCallChart: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  renderPushToCallAccounts() {
    const { isLoadingPushToCall, numberOfAccounts } = this.state;
    if (!isLoadingPushToCall) {
      return (
        <div className={numberOfAccounts.length > 0 ? '' : 'dashboard-content-center'}>
          {
            numberOfAccounts.length > 0 ?
              numberOfAccounts.map(account => {
                return <DashboardListItem key={account._id} data={account} type={ManagerWidgets.PUSH_TO_CALL} />;
              })
              : <div className="dashboard-empty-content">
                No push to call accounts has been found.
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

  renderPushToCallAccountsChart() {
    const { filters } = this.props;
    const { isLoadingPushToCallChart, numberOfAccountsChartData } = this.state;

    let chartOptions = {
      xAxisTitle: 'Clients',
      yAxisTitle: 'Number of Push To Call Accounts',
      title: 'Push To Call Ratio',
      ySeries: 'Push To Call Accounts'
    };

    if (!isLoadingPushToCallChart) {
      if (filters.selectedChartType.type === CHART_TYPE.Pie) {
        return (
          <PieChart data={numberOfAccountsChartData} chartOptions={chartOptions} />
        );
      }
      else if (filters.selectedChartType.type === CHART_TYPE.Line) {
        return (
          <LineChart data={numberOfAccountsChartData} chartOptions={chartOptions} />
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
          <div className="dashboard-sub-title">Push To Call</div>
        </div>
        <div className="dashboard-row content-height">
          <div className="dashboard-section">
            <div className="dashboard-section-content">
              {
                this.renderPushToCallAccounts()
              }
            </div>
          </div>
          <div className="dashboard-section">
            <div className="dashboard-section-content m-l-5">
              {
                this.renderPushToCallAccountsChart()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}