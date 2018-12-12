import React from "react";
import Highcharts from "highcharts";
import ReactHighcharts from "highcharts-react-official";
import Notifier from "/imports/client/lib/Notifier";
import DatePicker from "react-datepicker";
import moment from "moment";
import Loading from "/imports/client/lib/ui/Loading";

export default class ActivityGraph extends React.Component {
  constructor() {
    super();
    this.state = {
      graphData: [],
      selectedDate: moment(),
      isLoading: false
    };
  }

  componentWillMount() {
    const { selectedDate } = this.state;
    this.getAccountActions(new Date(selectedDate));
  }

  getAccountActions = date => {
    const { userId } = this.props;
    this.setState({ isLoading: true });
    Meteor.call("account.getActionPerHour", userId, date, (err, graphData) => {
      if (!err) {
        this.setState({
          graphData,
          isLoading: false
        });
      } else {
        this.setState({ isLoading: false });
        Notifier.error(err.reason);
      }
    });
  };

  onChange = newDate => {
    this.setState({ selectedDate: moment(newDate) }, () => {
      let selectedDate = new Date(this.state.selectedDate);
      this.getAccountActions(selectedDate);
    });
  };

 

  renderGraph() {
    const { graphData, isLoading } = this.state;
    const options = {
      chart: {
        type: "line",
        width: 600
      },
      xAxis: {
        title: { text: "Hours" }
      },
      yAxis: {
        title: { text: "Number of Action" }
      },
      title: {
        text: "Actions"
      },
      series: [
        {
          name: "Action per hour",
          data: graphData
        }
      ]
    };

    if (!isLoading) {
      return (
        <div className="line-chart">
          <ReactHighcharts highcharts={Highcharts} options={options} />
        </div>
      );
    }
    else {
      return <Loading />;
    }


  }

  render() {
    const { selectedDate } = this.state;

    return (
      <div>
        <div className="activity-container-header">
          <div className="activity-container-header-left">
            <div className="activity-container-title m-t--10">Activity Graph</div>
          </div>
          <div className="activity-container-header-right flex--helper form-group__pseudo--3">
            <div className="m-l-15">
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
        </div>
        {this.renderGraph()}
      </div>
    );
  }
}