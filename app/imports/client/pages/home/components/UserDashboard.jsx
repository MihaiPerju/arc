import React, { Component } from "react";
import DashboardListItem from "./DashboardListItem";
import { Meteor } from "meteor/meteor";
import Notifier from "/imports/client/lib/Notifier";
import { REP } from "../enums/widgetType";
import moment from "moment";

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      assignedList: [],
      selectedDate: moment(),
    };
  }

  componentWillReceiveProps(props) {
    const { facilityId, clientId } = props;
    this.getAssignedList(clientId, facilityId);
    this.getAssignedListGraph(clientId, facilityId);
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

  getAssignedListGraph = (clientId, facilityId) => {
    let userId = Meteor.userId();
    let date = new Date(this.state.selectedDate);
    setTimeout(() => {
      Meteor.call("account.getAssignedPerHour", clientId, facilityId, userId, date, (err, chartData) => {
        if (!err) {
         console.log('chartData', chartData);
        } else {
          Notifier.error(err.reason);
        }
      });
    }, 1500);

  }

  renderAssignedList = () => {
    let assignedList = this.state.assignedList;
    return (
      <div>
        {assignedList.length > 0 && assignedList.map(account => <DashboardListItem data={account} type={REP.ASSIGNED_ME} />)}
      </div>
    )
  }

  render() {
    return (
      <div className="dashboard-row">
        <div className="dashboard-section">
          <div className="dashboard-section-header m-t--5">
            <div className="dashboard-section-title">
              Assigned To Me
            </div>
          </div>
          <div className="dashboard-section-content">
            {
              this.renderAssignedList()
            }
          </div>
        </div>
      </div>
    );
  }
}