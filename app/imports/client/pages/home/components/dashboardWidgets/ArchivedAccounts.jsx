import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import moment from "moment";
import DashboardListItem from "../DashboardListItem";
import { ManagerWidgets } from "../../enums/widgetType";
import Loading from "../../../../lib/ui/Loading";
import CHART_TYPE from "../../enums/chartType";
import PieChart from "../PieChart";
import LineChart from "../LineChart";


export default class ArchivedAccounts extends React.Component {

  state = {
    isLoadingArchivedAccounts: false,
    archivedAccounts: [],
    isLoadingArchivedAccountChart: false,
    archivedAccountsChartData: []
  };

  componentDidMount() {
    const { filters } = this.props;
    this.getArchivedAccounts(filters.selectedClientId, filters.selectedFacilityId);
    this.getArchivedAccountsChartData(filters.selectedClientId, filters.selectedFacilityId);
  }

  componentWillReceiveProps(props) {
    const { filters } = props;
    this.getArchivedAccounts(filters.selectedClientId, filters.selectedFacilityId);
    this.getArchivedAccountsChartData(filters.selectedClientId, filters.selectedFacilityId);
  }

  getArchivedAccounts(clientId, facilityId) {
    this.setState({ isLoadingArchivedAccounts: true });
    setTimeout(() => {
      Meteor.call("accountsArchived.get", clientId, facilityId, (err, responseData) => {
        if (!err) {
          this.setState({ archivedAccounts: responseData, isLoadingArchivedAccounts: false });
        } else {
          this.setState({ isLoadingArchivedAccounts: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  getArchivedAccountsChartData(clientId, facilityId) {
    this.setState({ isLoadingArchivedAccountChart: true });
    setTimeout(() => {
      Meteor.call("account.getAssignedPerHour", clientId, facilityId, '', new Date(moment()), (err, chartData) => {
        if (!err) {
          this.setState({ archivedAccountsChartData: chartData, isLoadingArchivedAccountChart: false });
        } else {
          this.setState({ isLoadingArchivedAccountChart: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  renderArchivedAccounts() {
    const { isLoadingArchivedAccounts, archivedAccounts } = this.state;
    if (!isLoadingArchivedAccounts) {
      return (
        <div className={archivedAccounts.length > 0 ? '' : 'dashboard-content-center'}>
          {
            archivedAccounts.length > 0 ?
              archivedAccounts.map(account => {
                return <DashboardListItem key={account._id} data={account} type={ManagerWidgets.ARCHIVED_ACCOUNTS} />;
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

  renderArchivedAccountsChart() {
    const { filters } = this.props;
    const { isLoadingArchivedAccountChart, archivedAccountsChartData } = this.state;

    let chartOptions = {
      xAxisTitle: 'Hours',
      yAxisTitle: 'Number of archived accounts',
      title: 'Archived Accounts',
      ySeries: 'Archived accounts per hour'
    };

    if (!isLoadingArchivedAccountChart) {
      if (filters.selectedChartType.type === CHART_TYPE.Pie) {
        return (
          <PieChart data={archivedAccountsChartData} chartOptions={chartOptions} />
        );
      }
      else if (filters.selectedChartType.type === CHART_TYPE.Line) {
        return (
          <LineChart data={archivedAccountsChartData} chartOptions={chartOptions} />
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
                this.renderArchivedAccountsChart()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}