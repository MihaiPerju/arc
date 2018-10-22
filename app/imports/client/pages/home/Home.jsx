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

export default class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      isLoading: true,
      isLoadingGraph: true,
      reps: [],
      chartData: [],
      selectedDate: moment(),
      selectedRep: ''
    };
  }

  componentDidMount() {
    this.getRepresentatives();
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
    console.log(userId);
    let date = new Date(this.state.selectedDate);
    this.setState({ isLoadingGraph: true });
    setTimeout(() => {
      Meteor.call("account.getActionPerHour", userId, date, (err, chartData) => {
        if (!err) {
          this.setState({
            chartData, isLoadingGraph: false
          });
          console.log(chartData);
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
    const { reps, selectedDate } = this.state;
    if (Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) {
      return (
        <div className="cc-container home-container flex-align--start">
          <div className="heart-beat">
            {
              !this.state.isLoading ?
                <AutoForm ref="graphFilters" schema={heartBeatSchema} onSubmit={this.onSubmit.bind(this)}>
                  <div className="flex--helper form-group__pseudo--3">
                    <div className="select-form">
                      <AutoField
                        label="Reps:"
                        name="userId"
                        options={reps}
                      />
                    </div>
                    <div className="m-l-15">
                      <label>Select Date:</label>
                      <div className="border-style">
                        <DatePicker
                          calendarClassName="cc-datepicker"
                          showMonthDropdown
                          showYearDropdown
                          yearDropdownItemNumber={4}
                          todayButton={"Today"}
                          selected={selectedDate}
                          onChange={this.onChange}
                          placeholderText="Selected Date"
                          fixedHeight
                        />
                      </div>
                    </div>
                    <button className="custom-submit-btn" onClick={this.addGraphFilters}>
                      Submit
                    </button>
                  </div>
                </AutoForm> : <Loading />
            }
            {this.renderGraph()}
          </div>
        </div>
      );
    }
    else
      return null;
  }
}

const heartBeatSchema = new SimpleSchema({
  userId: {
    type: String
  }
});