import React, { Component } from "react";
import TableReport from "./TableReport";
import ScheduleBlock from "./../../ScheduleBlock.jsx";
import Notifier from "../../../../lib/Notifier";
import { EJSON } from "meteor/ejson";
import accountsQuery from "/imports/api/tasks/queries/taskList";
import moment from "moment/moment";
import JobQueueEnum from "/imports/api/jobQueue/enums/jobQueueTypes";
import JobQueueStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import jobQueueQuery from "/imports/api/jobQueue/queries/listJobQueues";

export class ReportHeader extends Component {
  constructor() {
    super();
    this.state = {
      schedule: false,
      accounts: []
    };
  }

  componentWillMount() {
    this.getTasks(this.props);
  }

  componentWillReceiveProps(props) {
    this.getTasks(props);
  }

  getTasks(props) {
    const { report } = props;
    const filters = EJSON.parse(report.mongoFilters);
    const options = { limit: 20 };
    accountsQuery.clone({ filters, options }).fetch((err, accounts) => {
      if (!err) {
        this.setState({
          accounts
        });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  openSchedule = () => {
    const { schedule } = this.state;
    this.setState({
      schedule: !schedule
    });
  };

  componentDidMount() {
    this.count.bind(this);
  }

  count = () => {
    const parent = document.getElementById("table");
    const sameClass = parent.getElementByClassName("table-container");
    for (i = 0; i < sameClass; i++) {
      console.log("sameClass.length");
    }
  };

  onEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };

  onRunReport = () => {
    const { report } = this.props;
    Meteor.call(
      "jobQueue.create",
      {
        reportId: report._id,
        type: JobQueueEnum.RUN_REPORT,
        status: JobQueueStatuses.IN_PROGRESS
      },
      err => {
        if (err) {
          Notifier.error(err.reason);
        } else {
          Notifier.success("Job started");
        }
      }
    );
  };

  downloadReport = () => {
    const { data } = this.props;
    const { reportId, _id } = data[0];
    window.open("/report/" + reportId + "/" + _id);
  };

  getRunButton(status) {
    switch (status) {
      case JobQueueStatuses.IN_PROGRESS:
        return (
          <button style={{ marginLeft: "2rem" }} className="btn--white">
            Loading...
          </button>
        );
      case JobQueueStatuses.FINISHED:
        return (
          <button
            onClick={this.downloadReport}
            style={{ marginLeft: "2rem" }}
            className="btn--white"
          >
            Download report
          </button>
        );
      default:
        return (
          <button
            style={{ marginLeft: "2rem" }}
            onClick={this.onRunReport}
            className="btn--white"
          >
            Run report
          </button>
        );
    }
  }

  render() {
    const { report, data } = this.props;
    const { schedule, accounts } = this.state;
    const job = data[0];
    console.log(job);
    const mainTable = {
      header: "Account name",
      row: accounts.map((task, index) => {
        return { title: "Account No." + (index + 1) };
      })
    };

    const tableList = [
      {
        header: "Account number",
        row: accounts.map((task, index) => {
          return { title: task.acctNum };
        })
      },
      {
        header: "Discharge date",
        row: accounts.map((task, index) => {
          return { title: moment(task.dischrgDate).format("MM/DD/YYYY hh:mm") };
        })
      },
      {
        header: "Patient Type",
        row: accounts.map((task, index) => {
          return { title: task.ptType };
        })
      },
      {
        header: "Facility Code",
        row: accounts.map((task, index) => {
          return { title: task.facCode };
        })
      },
      {
        header: "Patient Name",
        row: accounts.map((task, index) => {
          return { title: task.ptName };
        })
      }
    ];
    return (
      <div className="main-content report-content">
        {schedule ? (
          <ScheduleBlock report={report} />
        ) : (
          <div className="main-content__header header-block">
            <div className="row__header">
              <div className="text-light-grey">Report name</div>
              <div className="title">{report.name}</div>
            </div>
            <div className="row__header">
              <div className="plasment-block">
                <div className="text-light-grey">Placement date</div>
                <div className="time">11:20</div>
              </div>
              <div className="btn-group">
                <button className="btn--white" onClick={this.openSchedule}>
                  Schedule
                </button>
                <button onClick={this.onEdit} className="btn--white">
                  Edit report
                </button>
                {this.getRunButton(job && job.status)}
              </div>
            </div>
          </div>
        )}
        {!schedule && (
          <div className="table-list">
            <div className="left-side">
              <TableReport title={mainTable.header} rows={mainTable.row} />
            </div>
            <div className="right-side" id="table">
              {tableList.map(function(table, index) {
                return (
                  <TableReport
                    center
                    key={index}
                    title={table.header}
                    rows={table.row}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withQuery(
  props => {
    return jobQueueQuery.clone({ filters: { reportId: props.report._id } });
  },
  { reactive: true }
)(ReportHeader);
