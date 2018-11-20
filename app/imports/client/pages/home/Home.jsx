import React from "react";

import Highcharts from "highcharts";
import ReactHighcharts from "highcharts-react-official";
import Notifier from "/imports/client/lib/Notifier";
import SimpleSchema from "simpl-schema";
import DatePicker from "react-datepicker";
import moment from "moment";
import { AutoForm, AutoField } from "/imports/ui/forms";
import Loading from "/imports/client/lib/ui/Loading";
import RolesEnum from "../../../api/users/enums/roles";
import RepDashboard from "./components/RepDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import CHART_TYPE from './enums/chartType';

export default class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      isLoading: true,
      isLoadingGraph: true,
      reps: [],
      chartData: [],
      selectedDate: moment(),
      selectedRep: '',
      clients: [],
      facilities: [],
      selectedClientId: '',
      selectedFacilityId: '',
      chartTypes: [],
      selectedChartType: '',
      filters: { selectedClientId: '', selectedFacilityId: '', selectedChartType: '', },
      managerDashboardData: {
        isLoadingAssignedAccounts: false,
        assignedAccounts: [],
        isLoadingArchivedAccounts: false,
        archivedAccounts: [],
        isLoadingAssignedAccountChart: false,
        assignedAccountsChartData: {},
        isLoadingArchivedAccountChart: false,
        archivedAccountsChartData: {},
        isLoadingBuiltReports: false,
        builtReports: [],
        isLoadingReportsBuilt: false,
        reportsBuiltChartData: []
      }
    };
  }
  componentWillMount() {
    this.prepareChartTypes();
  }

  componentDidMount() {
    this.getClients();
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
    Meteor.call("clients.get", (err, responseData) => {
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
    Meteor.call("facilities.get", clientId, (err, responseData) => {
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

  onHandleChange = (field, value) => {
    let filters = this.state.filters;
    switch (field) {
      case "clientId":
        filters.selectedClientId = value;
        this.setState({ filters });
        this.getFacilities(value);
        break;
      case "facilityId":
        filters.selectedFacilityId = value;
        this.setState({ filters });
        break;
      case "selectChartTypeId":
        let chartTypes = this.state.chartTypes;
        let chartType = chartTypes.find(p => p.value == value);
        let selectedChartType = chartTypes[0];
        if (chartType)
          selectedChartType = chartType;

        filters.selectedChartType = selectedChartType;
        this.setState({ filters });
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

  render() {
    const { clients, facilities, chartTypes, selectedChartType } = this.state;
    if (Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) {

      // return (
      //   <div className="cc-container home-container flex-align--start">
      //     <div className="heart-beat">
      //       {
      //         !this.state.isLoading ?
      //           <AutoForm ref="graphFilters" schema={heartBeatSchema} onSubmit={this.onSubmit.bind(this)}>
      //             <div className="flex--helper form-group__pseudo--3">
      //               <div className="select-form">
      //                 <AutoField
      //                   label="Reps:"
      //                   name="userId"
      //                   options={reps}
      //                 />
      //               </div>
      //               <div className="m-l-15">
      //                 <label>Select Date:</label>
      //                 <div className="border-style">
      //                   <DatePicker
      //                     calendarClassName="cc-datepicker"
      //                     showMonthDropdown
      //                     showYearDropdown
      //                     yearDropdownItemNumber={4}
      //                     todayButton={"Today"}
      //                     selected={selectedDate}
      //                     onChange={this.onChange}
      //                     placeholderText="Selected Date"
      //                     fixedHeight
      //                   />
      //                 </div>
      //               </div>
      //               <button className="custom-submit-btn" onClick={this.addGraphFilters}>
      //                 Submit
      //               </button>
      //             </div>
      //           </AutoForm> : <Loading />
      //       }
      //       {this.renderGraph()}
      //     </div>
      //   </div>
      // );

      return (
        <div className="dashboard-content-container">
          <div className="dashboard-header-content">
            <AutoForm schema={dashboardSchema} onChange={this.onHandleChange.bind(this)}>
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
                {
                  facilities.length > 0 ?
                    <div className="select-form select-box-width m-l-15">
                      <label className="dashboard-label">Facilities</label>
                      <div className="m-t--5">
                        <AutoField
                          labelHidden={true}
                          name="facilityId"
                          options={facilities} />
                      </div>
                    </div> : null
                }
                <div className="select-form select-box-width m-l-15">
                  <label className="dashboard-label">Chart Types</label>
                  <div className="m-t--5">
                    <AutoField
                      labelHidden={true}
                      name="selectChartTypeId"
                      options={chartTypes} />
                  </div>
                </div>
              </div>
            </AutoForm>
          </div>
          <ManagerDashboard data={this.state.managerDashboardData} chartType={selectedChartType.type} filters={this.state.filters} />
        </div>
      );


    }
    else if (Roles.userIsInRole(Meteor.userId(), RolesEnum.REP)) {
      return (
        <RepDashboard />
      );
    }
    else
      return null;
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
  }
});