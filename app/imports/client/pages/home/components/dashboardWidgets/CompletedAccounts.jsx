import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import DashboardListItem from "../DashboardListItem";
import { REP } from "../../enums/widgetType";
import Loading from "../../../../lib/ui/Loading";
import CHART_TYPE from "../../enums/chartType";
import PieChart from "../PieChart";
import LineChart from "../LineChart";
import FilterService from "../../services/FilterService";

export default class CompletedAccounts extends React.Component {

  state = {
    isLoadingCompletedAccounts: false,
    completedAccounts: [],
    isLoadingCompletedChart: false,
    completedAccountsChartData: []
  };

  componentDidMount() {
    const { filters } = this.props;
    this.getCompletedAccounts(filters);
    this.getCompletedAccountsChartData(filters);
  }

  componentWillReceiveProps(props) {
    const { filters } = props;
    this.getCompletedAccounts(filters);
    this.getCompletedAccountsChartData(filters);
  }

  getCompletedAccounts = (filters) => {
    this.setState({ isLoadingCompletedAccounts: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    Meteor.call("accountsHold.get", filters.selectedClientId, filters.selectedFacilityId, Meteor.userId(), filterCondition, (err, data) => {
      if (!err) {
        this.setState({
          completedAccounts: data,
          isLoadingCompletedAccounts: false
        });
      } else {
        this.setState({ isLoadingCompletedAccounts: false });
        Notifier.error(err.reason);
      }
    });
  }

  getCompletedAccountsChartData = (filters) => {
    let userId = Meteor.userId();
    this.setState({ isLoadingCompletedChart: true });
    let filterCondition = FilterService.getQuery(filters.selectedDateRange, filters.startDate, filters.endDate);
    setTimeout(() => {
      Meteor.call("account.getHoldAccountsPerHour", filters.selectedClientId, filters.selectedFacilityId, userId, filterCondition, (err, holdAccountChartData) => {
        if (!err) {
          this.setState({ completedAccountsChartData: holdAccountChartData, isLoadingCompletedChart: false });
        } else {
          Notifier.error(err.reason);
          this.setState({ isLoadingCompletedChart: false });
        }
      });
    }, 1500);
  }

  renderCompletedAccounts() {
    const { isLoadingCompletedAccounts, completedAccounts } = this.state;
    if (!isLoadingCompletedAccounts) {
      return (
        <div className={completedAccounts.length > 0 ? '' : 'dashboard-content-center'}>
          {
            completedAccounts.length > 0 ?
              completedAccounts.map(account => {
                return <DashboardListItem key={account._id} data={account} type={REP.COMPLETED} />;
              })
              : <div className="dashboard-empty-content">
                No completed accounts has been found.
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

  renderCompletedAccountsChartData() {
    const { filters } = this.props;
    const { isLoadingCompletedChart, completedAccountsChartData } = this.state;

    let chartOptions = {
      xAxisTitle: 'Hours',
      yAxisTitle: 'Number of Accounts',
      title: 'Accounts',
      ySeries: 'Accounts per hour'
    };

    if (!isLoadingCompletedChart) {
      if (filters.selectedChartType.type === CHART_TYPE.Pie) {
        return (
          <PieChart data={completedAccountsChartData} chartOptions={chartOptions} />
        );
      }
      else if (filters.selectedChartType.type === CHART_TYPE.Line) {
        return (
          <LineChart data={completedAccountsChartData} chartOptions={chartOptions} />
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
          <div className="dashboard-sub-title">Completed</div>
        </div>
        <div className="dashboard-row content-height">
          <div className="dashboard-section">
            <div className="dashboard-section-content">
              {
                this.renderCompletedAccounts()
              }
            </div>
          </div>
          <div className="dashboard-section">
            <div className="dashboard-section-content m-l-5">
              {
                this.renderCompletedAccountsChartData()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}