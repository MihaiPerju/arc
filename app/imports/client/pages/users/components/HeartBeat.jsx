import React from "react";
import Highcharts from "highcharts";
import ReactHighcharts from "highcharts-react-official";
import Notifier from "/imports/client/lib/Notifier";
import SimpleSchema from "simpl-schema";
import DatePicker from "react-datepicker";
import moment from "moment";
import { AutoForm, AutoField } from "/imports/ui/forms";
import Loading from "/imports/client/lib/ui/Loading";

export default class HeartBeat extends React.Component {
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
    let date = new Date(this.state.selectedDate);
    this.setState({ isLoadingGraph: true });
    Meteor.call("account.getActionPerHour", userId, date, (err, chartData) => {
      if (!err) {
        this.setState({
          chartData, isLoadingGraph: false
        });
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  submitData = ({ userId }) => {
    this.setState({ selectedRepId: userId }, () => {
      this.getAccountActions();
    });
  }

  submit = () => {
    this.getAccountActions();
  }

  onChange = newDate => {
    this.setState({ selectedDate: moment(newDate) });
  };

  render() {
    const { chartData, reps, selectedDate } = this.state;
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
          data: chartData
        }
      ]
    };
    return (
      <div className="heart-beat">
        {
          !this.state.isLoading ?
            <AutoForm schema={heartBeatSchema} onSubmit={this.submitData}>
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
                <button type="submit" className="custom-submit-btn" onClick={this.submit}>
                  Submit
              </button>
              </div>
            </AutoForm> : <Loading />
        }
        {
          !this.state.isLoadingGraph ? <div className="m-t--20">
            <div>
              <ReactHighcharts highcharts={Highcharts} options={options} />
            </div>
          </div> : <Loading />
        }

      </div>
    );
  }
}

const heartBeatSchema = new SimpleSchema({
  userId: {
    type: String
  }
});