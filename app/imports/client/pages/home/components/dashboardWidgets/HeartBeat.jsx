import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "../../../../lib/ui/Loading";
import { AutoForm, AutoField } from "/imports/ui/forms";
import moment from "moment";
import DatePicker from "react-datepicker";
import SimpleSchema from "simpl-schema";
import Highcharts from "highcharts";
import ReactHighcharts from "highcharts-react-official";

export default class HeartBeat extends React.Component {

  state = {
    isLoading: true,
    isLoadingGraph: true,
    reps: [],
    chartData: [],
    selectedDate: moment(),
    selectedRep: ''
  };

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

  addGraphFilters = () => {
    this.onSubmit();
  }

  onChange = newDate => {
    this.setState({ selectedDate: moment(newDate) });
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

  renderGraph() {
    const options = {
      chart: {
        type: "line",
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
    return (
      <div className="heart-beat-widget">
        <div className="heart-beat-widget-header">
          <div className="heart-beat-widget-header-left">
            <div className="heart-beat-widget-title">Heart Beat</div>
          </div>
          <div className="heart-beat-widget-header-right">
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
            </AutoForm>
          </div>
        </div>
        {this.renderGraph()}
      </div>
    );
  }
}

const heartBeatSchema = new SimpleSchema({
  userId: {
    type: String
  }
});