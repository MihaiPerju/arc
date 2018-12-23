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
    selectedRep: "",
    total: 0
  };

  componentDidMount() {
    this.getRepresentatives();
  }

  getRepresentatives() {
    Meteor.call("users.getReps", (err, repsData) => {
      if (!err) {
        let reps = repsData.map(r => {
          return {
            label: `${r.profile.firstName} ${r.profile.lastName}`,
            value: r._id
          };
        });
        let selectedRep = reps[0];
        this.setState(
          {
            reps,
            isLoading: false,
            selectedRepId: selectedRep != undefined ? selectedRep.value : ""
          },
          () => {
            this.getAccountActions();
          }
        );
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
      Meteor.call("account.getActionPerHour", userId, date, (err, result) => {
        if (!err) {
          const { graphData, total } = result;
          this.setState({
            chartData: graphData,
            isLoadingGraph: false,
            total
          });
        } else {
          Notifier.error(err.reason);
        }
      });
    }, 1500);
  };

  onChange = newDate => {
    this.setState({ selectedDate: moment(newDate) }, () => {
      this.getAccountActions();
    });
  };

  updateGraph = (key, value) => {
    if (key === "userId") {
      this.setState({ selectedRepId: value }, () => {
        this.getAccountActions();
      });
    }
  };

  renderGraph() {
    const { total } = this.state;
    const options = {
      chart: {
        type: "line"
      },
      xAxis: {
        title: { text: "Hours" }
      },
      yAxis: {
        title: { text: "Number of Actions" }
      },
      title: {
        text: "Rep Actions (" + total + " Total)"
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
            <AutoForm
              ref="graphFilters"
              schema={heartBeatSchema}
              onChange={this.updateGraph}
            >
              <div className="flex--helper form-group__pseudo--3">
                <div className="select-form">
                  <AutoField label="Reps:" name="userId" options={reps} />
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
