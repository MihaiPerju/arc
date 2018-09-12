import React from "react";
import Highcharts from "highcharts";
import ReactHighcharts from "highcharts-react-official";
import Notifier from "/imports/client/lib/Notifier";
import DatePicker from "react-datepicker";
import moment from "moment";

export default class ActivityStreamGraph extends React.Component {
  constructor() {
    super();
    this.state = {
      graphData: [],
      selectedDate: moment()
    };
  }

  componentWillMount() {
    const { selectedDate } = this.state;
    this.getAccountActions(new Date(selectedDate));
  }

  getAccountActions = date => {
    const { userId } = FlowRouter.current().params;
    Meteor.call("account.getActionPerHour", userId, date, (err, graphData) => {
      if (!err) {
        this.setState({
          graphData
        });
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  onChange = newDate => {
    this.setState({ selectedDate: moment(newDate) });
  };

  onSubmit = date => {
    this.getAccountActions(date);
  };

  render() {
    const { graphData, selectedDate } = this.state;
    const options = {
      chart: {
        type: "line"
      },
      xAxis: {
        title: { text: "Hours" }
      },
      yAxis: {
        title: { text: "Number of Action" }
      },
      title: {
        text: "Activity Timeline Graph"
      },
      series: [
        {
          name: "Action per hour",
          data: graphData
        }
      ]
    };
    return (
      <div style={{ width: "450px" }}>
        <div style={{ width: "100%" }}>
          <ReactHighcharts highcharts={Highcharts} options={options} />
        </div>
        <div
          style={{
            marginTop: "20px",
            width: "100%",
            background: "white",
            padding: "10px"
          }}
        >
          <DatePicker
            showMonthDropdown
            showYearDropdown
            yearDropdownItemNumber={4}
            todayButton={"Today"}
            selected={selectedDate}
            onChange={this.onChange}
            placeholderText="Select New Date"
            fixedHeight
          />
        </div>
        <button
          style={{ background: "orange" }}
          onClick={this.onSubmit.bind(
            this,
            selectedDate && selectedDate.toDate()
          )}
        >
          Submit
        </button>
      </div>
    );
  }
}
