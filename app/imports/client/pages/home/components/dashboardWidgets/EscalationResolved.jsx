import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import moment from "moment";
import DashboardListItem from "../DashboardListItem";
import { ManagerWidgets } from "../../enums/widgetType";
import Loading from "../../../../lib/ui/Loading";
import CHART_TYPE from "../../enums/chartType";
import PieChart from "../PieChart";
import LineChart from "../LineChart";


export default class EscalationResolved extends React.Component {

  state = {
    isLoadingEscalationResolved: false,
    escalations: [],
    isLoadingEscalationResolvedChart: false,
    escalationResolvedChartData: []
  };

  componentDidMount() {
    const { filters } = this.props;
    this.getEscalationResolved(filters.selectedClientId, filters.selectedFacilityId);
    this.getEscalationResolvedChartData(filters.selectedClientId, filters.selectedFacilityId);
  }

  componentWillReceiveProps(props) {
    const { filters } = props;
    this.getEscalationResolved(filters.selectedClientId, filters.selectedFacilityId);
    this.getEscalationResolvedChartData(filters.selectedClientId, filters.selectedFacilityId);
  }

  getEscalationResolved(clientId, facilityId) {
    this.setState({ isLoadingEscalationResolved: true });
    setTimeout(() => {
      Meteor.call("escalationResolved.get", clientId, facilityId, '', (err, responseData) => {
        if (!err) {
          this.setState({ escalations: responseData, isLoadingEscalationResolved: false });
        } else {
          this.setState({ isLoadingEscalationResolved: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  getEscalationResolvedChartData(clientId, facilityId) {
    this.setState({ isLoadingEscalationResolvedChart: true });
    setTimeout(() => {
      Meteor.call("escalationResolved.getPerHour", clientId, facilityId, new Date(moment()), (err, chartData) => {
        if (!err) {
          this.setState({ escalationResolvedChartData: chartData, isLoadingEscalationResolvedChart: false });
        } else {
          this.setState({ isLoadingEscalationResolvedChart: false });
          Notifier.error(err.reason);
        }
      });
    }, 1000);
  }

  renderEscalationResolved() {
    const { isLoadingEscalationResolved, escalations } = this.state;
    if (!isLoadingEscalationResolved) {
      return (
        <div className={escalations.length > 0 ? '' : 'dashboard-content-center'}>
          {
            escalations.length > 0 ?
              escalations.map(account => {
                return <DashboardListItem key={account._id} data={account} type={ManagerWidgets.ESCALATION_RESOLVED} />;
              })
              : <div className="dashboard-empty-content">
                No escalation resolved accounts has been found.
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

  renderEscalationResolvedChart() {
    const { filters } = this.props;
    const { isLoadingEscalationResolvedChart, escalationResolvedChartData } = this.state;

    let chartOptions = {
      xAxisTitle: 'Hours',
      yAxisTitle: 'Number of Escalations',
      title: 'Escalations',
      ySeries: 'Escalations resolved per hour'
    };

    if (!isLoadingEscalationResolvedChart) {
      if (filters.selectedChartType.type === CHART_TYPE.Pie) {
        return (
          <PieChart data={escalationResolvedChartData} chartOptions={chartOptions} />
        );
      }
      else if (filters.selectedChartType.type === CHART_TYPE.Line) {
        return (
          <LineChart data={escalationResolvedChartData} chartOptions={chartOptions} />
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
          <div className="dashboard-sub-title">Escalation Resolved</div>
        </div>
        <div className="dashboard-row content-height">
          <div className="dashboard-section">
            <div className="dashboard-section-content">
              {
                this.renderEscalationResolved()
              }
            </div>
          </div>
          <div className="dashboard-section">
            <div className="dashboard-section-content m-l-5">
              {
                this.renderEscalationResolvedChart()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}