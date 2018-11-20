import React, { Component } from "react";
import DashboardListItem from "./DashboardListItem";
import { Meteor } from "meteor/meteor";
import Notifier from "/imports/client/lib/Notifier";
import { REP } from "../enums/widgetType";
import moment from "moment";
import Highcharts from "highcharts";
import ReactHighcharts from "highcharts-react-official";
import Loading from "/imports/client/lib/ui/Loading";
import LineChart from "./LineChart";
import CHART_TYPE from "../enums/chartType";
import PieChart from "./PieChart";

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      assignedList: [],
      holdList: [],
      selectedDate: moment(),
      isLoadingLineGraph: false,
      assignedChartData: null,
      holdAccountChartData: null,
      chartType: null
    };
  }

  componentWillReceiveProps(props) {
    const { clientId, facilityId, chartType } = props;
    this.setState({ chartType: chartType.type });
    //Assigned List
    this.getAssignedList(clientId, facilityId);
    this.getAssignedListGraph(clientId, facilityId);
    this.getHoldList(clientId, facilityId);
    this.getHoldAccountLineGraph(clientId, facilityId);
  }


  getAssignedList = (clientId, facilityId) => {
    let userId = Meteor.userId();
    this.setState({ isLoading: true });
    Meteor.call("accountsAssigned.get", clientId, facilityId, userId, (err, assignedList) => {
      if (!err) {
        this.setState({
          assignedList,
          isLoading: false
        });
      } else {
        this.setState({ isLoading: false });
        Notifier.error(err.reason);
      }
    });
  }

  renderAssignedList = () => {
    let assignedList = this.state.assignedList;
    return (
      <div>
        {assignedList.length > 0 && assignedList.map((account, i) => <DashboardListItem data={account} type={REP.ASSIGNED_ME} key={i} />)}
      </div>
    )
  }

  getAssignedListGraph = (clientId, facilityId) => {
    let userId = Meteor.userId();
    let date = new Date(this.state.selectedDate);
    this.setState({ isLoadingLineGraph: true });
    setTimeout(() => {
      Meteor.call("account.getAssignedPerHour", clientId, facilityId, userId, date, (err, assignedChartData) => {
        if (!err) {
          this.setState({ assignedChartData, isLoadingLineGraph: false });
        } else {
          Notifier.error(err.reason);
          this.setState({ isLoadingLineGraph: false });
        }
      });
    }, 1500);

  }


  renderAssignedLineGraph() {
    const data = this.state;
    let chartOptions = {
      xAxisTitle: 'Hours',
      yAxisTitle: 'Number of Accounts',
      title: 'Accounts',
      ySeries: 'Accounts per hour'
    };
    if (data.chartType == CHART_TYPE.Line) {
      return (
        <LineChart data={data.assignedChartData} chartOptions={chartOptions} />
      );
    } else if (data.chartType == CHART_TYPE.Pie) {
      return (
        <PieChart data={data.assignedChartData} chartOptions={chartOptions} />
      );
    }

  }


  getHoldList = (clientId, facilityId) => {
    let userId = Meteor.userId();
    this.setState({ isLoading: true });
    Meteor.call("accountsHold.get", clientId, facilityId, userId, (err, data) => {
      if (!err) {
        this.setState({
          holdList: data,
          isLoading: false
        });
      } else {
        this.setState({ isLoading: false });
        Notifier.error(err.reason);
      }
    });
  }


  renderHoldList = () => {
    let holdList = this.state.holdList;
    return (
      <div>
        {holdList.length > 0 && holdList.map((account, i) => <DashboardListItem data={account} type={REP.ASSIGNED_ME} key={i} />)}
      </div>
    )
  }


  getHoldAccountLineGraph = (clientId, facilityId) => {
    let userId = Meteor.userId();
    let date = new Date(this.state.selectedDate);
    this.setState({ isLoadingLineGraph: true });
    setTimeout(() => {
      Meteor.call("account.getHoldAccountsPerHour", clientId, facilityId, userId, date, (err, holdAccountChartData) => {
        if (!err) {
          this.setState({ holdAccountChartData, isLoadingLineGraph: false });
        } else {
          Notifier.error(err.reason);
          this.setState({ isLoadingLineGraph: false });
        }
      });
    }, 1500);
  }


  renderHoldAccountLineGraph() {
    const data = this.state;
    let chartOptions = {
      xAxisTitle: 'Hours',
      yAxisTitle: 'Number of Accounts',
      title: 'Accounts',
      ySeries: 'Accounts per hour'
    };

    if (data.chartType == CHART_TYPE.Line) {
      return (
        <LineChart data={data.holdAccountChartData} chartOptions={chartOptions} />
      );
    } else if (data.chartType == CHART_TYPE.Pie) {
      return (
        <PieChart data={data.holdAccountChartData} chartOptions={chartOptions} />
      );
    }
  }

  render() {
    return (
      <div>
        <div className="dashboard-row">
          <div className="dashboard-sub-title">Assigned Accounts</div>
        </div>
        <div className="dashboard-row content-height">
          <div className="dashboard-section">
            <div className="dashboard-section-content">
              {
                this.renderAssignedList()
              }
            </div>
          </div>
          <div className="dashboard-section">
            <div className="dashboard-section-content m-l-5">
              {
                this.renderAssignedLineGraph()
              }
            </div>
          </div>
        </div>
        <div className="dashboard-row">
          <div className="dashboard-sub-title">Completed Accounts</div>
        </div>
        <div className="dashboard-row content-height">
          <div className="dashboard-section">
            <div className="dashboard-section-content">
              {
                this.renderHoldList()
              }
            </div>
          </div>
          <div className="dashboard-section">
            <div className="dashboard-section-content m-l-5">
              {
                this.renderHoldAccountLineGraph()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}