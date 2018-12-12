import React from "react";

import Highcharts from "highcharts";
import ReactHighcharts from "highcharts-react-official";
import Notifier from "/imports/client/lib/Notifier";
import SimpleSchema from "simpl-schema";
import moment from "moment";
import { AutoForm, AutoField } from "/imports/ui/forms";
import Loading from "/imports/client/lib/ui/Loading";
import RolesEnum from "../../../api/users/enums/roles";
//import RepDashboard from "./components/RepDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import CHART_TYPE from './enums/chartType';
import { dateRangeValues } from './enums/dateRange';
import TechOrAdminDashboard from "./components/TechOrAdminDashboard";
import UserDashboard from "./components/UserDashboard";

export default class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      isLoading: true,
      isLoadingGraph: true,
      reps: [],
      chartData: [],
      selectedDate: moment(),
      startDate: moment(),
      endDate: moment(),
      selectedRep: '',
      clients: [],
      facilities: [],
      users: [],
      chartTypes: [],
      selectedChartType: '',
      dateRangeFilters: [],
      showCustomDateRange: false,
      filters: { selectedClientId: '', selectedFacilityId: '', selectedChartType: '', selectedUserId: '', selectedDateRange: '', startDate: new Date(moment()), endDate: new Date(moment()) },
    };
  }

  componentWillMount() {
    this.prepareDateRangeOptions();
    this.prepareChartTypes();
  }

  componentDidMount() {
    this.getClients();
  }

  prepareDateRangeOptions() {
    let dateRangeFilters = dateRangeValues;
    dateRangeFilters.unshift({ label: 'Select Date', value: -1 });
    let selectedDateRange = dateRangeFilters[0].value;
    this.setState({ dateRangeFilters, selectedDateRange });
  }

  prepareChartTypes() {
    let filters = this.state.filters;
    let chartTypes = this.state.chartTypes;
    chartTypes.push({ value: 1, label: 'Line Chart', type: CHART_TYPE.Line });
    chartTypes.push({ value: 2, label: 'Pie Chart', type: CHART_TYPE.Pie });
    filters.selectedChartType = chartTypes[0];
    this.setState({ chartTypes: chartTypes, filters });
  }

  getClients() {
    Meteor.call("clients.fetch", (err, responseData) => {
      if (!err) {
        let clients = responseData.map(client => {
          return { label: client.clientName, value: client._id };
        });
        clients.unshift({ label: 'All Clients', value: -1 });
        this.setState({ clients });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  getFacilities(clientId) {
    Meteor.call("facilities.fetch", clientId, (err, responseData) => {
      if (!err) {
        let facilities = [];
        facilities = responseData.map(facility => {
          return { label: facility.name, value: facility._id };
        });
        if (facilities.length > 0) {
          facilities.unshift({ label: 'All Facilities', value: -1 });
        }
        this.setState({ facilities });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  getUsers(facilityId) {
    Meteor.call("account.facility.user", facilityId, (err, responseData) => {
      if (!err) {
        let users = [];
        users = responseData;
        if (users.length > 0) {
          users.unshift({ label: 'All Users', value: -1 });
        }
        this.setState({ users });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  getRepresentatives() {
    Meteor.call("users.getReps", (err, repsData) => {
      if (!err) {
        let reps = repsData.map(r => {
          return { label: `${r.profile.firstName} ${r.profile.lastName}`, value: r._id };
        });
        let selectedRep = reps[0];
        this.setState({ reps, isLoading: false, selectedRepId: selectedRep != undefined ? selectedRep.value : '' }, () => {
          this.getAccountActions();
        });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  getAccountActions = () => {
    let userId = this.state.selectedRepId;
    let date = new Date(this.state.selectedDate);
    this.setState({ isLoadingGraph: true });
    setTimeout(() => {
      Meteor.call("account.getActionPerHour", userId, date, (err, chartData) => {
        if (!err) {
          this.setState({
            chartData, isLoadingGraph: false
          });
        } else {
          Notifier.error(err.reason);
        }
      });
    }, 1500);
  };

  onSubmit(params) {
    if (params) {
      this.setState({ selectedRepId: params.userId }, () => {
        this.getAccountActions();
      });
    } else {
      this.getAccountActions();
    }
  }

  addGraphFilters = () => {
    this.onSubmit();
  }

  onChange = newDate => {
    this.setState({ selectedDate: moment(newDate) });
  };

  onStartDateChange = startDate => {
    let filters = this.state.filters;
    filters.startDate = new Date(moment(startDate));
    this.setState({ startDate: moment(startDate), filters });
  };

  onEndDateChange = endDate => {
    let filters = this.state.filters;
    filters.endDate = new Date(moment(endDate));
    this.setState({ endDate: moment(endDate), filters });
  };

  onHandleChange = (field, value) => {
    let filters = this.state.filters;
    switch (field) {
      case "clientId":
        filters.selectedClientId = value;
        this.setState({ filters, facilities: [], users: [] });
        this.getFacilities(value);
        break;
      case "facilityId":
        filters.selectedFacilityId = value;
        this.setState({ filters, users: [] });
        this.getUsers(value);
        break;
      case "userId":
        filters.selectedUserId = value;
        this.setState({ filters });
        break;
      case "selectChartTypeId":
        var chartTypes = this.state.chartTypes;
        var chartType = chartTypes.find(p => p.value == value);
        var selectedChartType = chartTypes[0];
        if (chartType)
          selectedChartType = chartType;

        filters.selectedChartType = selectedChartType;
        this.setState({ filters });
        break;
      case "selectedDateRange":
        filters.selectedDateRange = value;
        if (value === 'custom_range') {
          this.setState({ filters, showCustomDateRange: true });
        }
        else {
          this.setState({ filters, showCustomDateRange: false });
        }
        break;
      default:
        break;
    }
  }

  renderGraph() {
    const options = {
      chart: {
        type: "line",
        width: 640
      },
      xAxis: {
        title: { text: "Hours" }
      },
      yAxis: {
        title: { text: "Number of Actions" }
      },
      title: {
        text: "Rep Actions"
      },
      series: [
        {
          name: "Actions per hour",
          data: this.state.chartData
        }
      ]
    };

    if (!this.state.isLoadingGraph) {
      return (
        <div className="m-t--20">
          <div>
            <ReactHighcharts highcharts={Highcharts} options={options} />
          </div>
        </div>
      );
    } else {
      return <Loading />;
    }
  }

  renderDashboardBasedOnRoles() {
    const { filters } = this.state;
    if (Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) {
      return <ManagerDashboard filters={filters} />;
    }

    if (Roles.userIsInRole(Meteor.userId(), RolesEnum.TECH) || Roles.userIsInRole(Meteor.userId(), RolesEnum.ADMIN)) {
      return <TechOrAdminDashboard filters={filters} />;
    }

    if (Roles.userIsInRole(Meteor.userId(), RolesEnum.REP)) {
      return <UserDashboard filters={filters} />;
    }
  }

  render() {
    const { clients } = this.state;

    return (
      <div className="dashboard-content-container">
        {
          (Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER) || Roles.userIsInRole(Meteor.userId(), RolesEnum.TECH) || Roles.userIsInRole(Meteor.userId(), RolesEnum.ADMIN)) &&
          <div className="dashboard-header-content">
            <div className="dashboard-header-title">
              FILTERS FOR DASHBOARD
            </div>
            <AutoForm schema={dashboardSchema} onChange={this.onHandleChange.bind(this)}>
              <div>
                <div className="flex--helper form-group__pseudo--3">
                  <div className="select-form select-box-width">
                    <label className="dashboard-label">Clients</label>
                    <div className="m-t--5">
                      <AutoField
                        labelHidden={true}
                        name="clientId"
                        options={clients}
                      />
                    </div>
                  </div>
                  {/* {
                  facilities.length > 0 ?
                    <div className="select-form select-box-width m-l-10">
                      <label className="dashboard-label">Facilities</label>
                      <div className="m-t--5">
                        <AutoField
                          labelHidden={true}
                          name="facilityId"
                          options={facilities} />
                      </div>
                    </div> : null
                }
                {
                  users.length > 0 ?
                    <div className="select-form select-box-width m-l-10">
                      <label className="dashboard-label">Users</label>
                      <div className="m-t--5">
                        <AutoField
                          labelHidden={true}
                          name="userId"
                          options={users} />
                      </div>
                    </div> : null
                } */}
                </div>
              </div>
            </AutoForm>
          </div>
        }
        {this.renderDashboardBasedOnRoles()}
      </div>
    );
  }
}

// const heartBeatSchema = new SimpleSchema({
//   userId: {
//     type: String
//   }
// });

const dashboardSchema = new SimpleSchema({
  clientId: {
    type: String
  },
  facilityId: {
    type: String
  },
  selectChartTypeId: {
    type: String
  },
  userId: {
    type: String
  },
  selectedDateRange: {
    type: String
  }
});