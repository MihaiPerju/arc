import React, { Component } from "react";
import moment from "moment/moment";
import ScheduleBlock from "./../../ScheduleBlock.jsx";
import Notifier from "../../../../lib/Notifier";
import accountsQuery from "/imports/api/accounts/queries/accountList";
import JobQueueEnum from "/imports/api/jobQueue/enums/jobQueueTypes";
import JobQueueStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import jobQueueQuery from "/imports/api/jobQueue/queries/listJobQueues";
import { EJSON } from "meteor/ejson";
import Loading from "/imports/client/lib/ui/Loading";
import Dialog from "/imports/client/lib/ui/Dialog";
import reportColumnListQuery from "/imports/api/reportColumns/queries/reportColumnList";

class ReportHeader extends Component {
  constructor() {
    super();
    this.state = {
      schedule: false,
      accounts: [],
      dialogIsActive: false,
      selectedReportColumns: []
    };
  }

  componentWillMount() {
    this.getAccounts(this.props);
    reportColumnListQuery.fetchOne((err, selectedReportColumns) => {
      if (!err) {
        const cols = [];
        for (var key in selectedReportColumns) {
          if (selectedReportColumns[key]) {
            if (typeof selectedReportColumns[key] === "object") {
              cols.push(selectedReportColumns[key]);
            } else if (key !== "_id") {
              cols.push(key);
            }
          }
        }
        this.setState({
          selectedReportColumns: cols
        });
      }
    });
  }

  componentWillReceiveProps(props) {
    this.getAccounts(props);
  }

  openDialog = () => {
    this.setState({
      dialogIsActive: true
    });
  };

  closeDialog = () => {
    this.setState({
      dialogIsActive: false
    });
  };

  getAccounts(props) {
    const { report } = props;
    const filters = EJSON.parse(report.mongoFilters);
    const options = { limit: 20 };
    accountsQuery.clone({ filters, options }).fetch((err, accounts) => {
      if (!err) {
        this.setState({
          accounts,
          loading: false
        });
      } else {
        Notifier.error("Couldn't get sample accounts");
      }
    });
  }

  openSchedule = () => {
    const { schedule } = this.state;
    this.setState({
      schedule: !schedule
    });
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
    const { reportId, _id } = data; 
    window.open("/report/" + reportId);
  };

  getRunButton = status => {
    switch (status) {
      case JobQueueStatuses.IN_PROGRESS:
        return (
          <button className="btn--white">
            Loading...
          </button>
        );
      case JobQueueStatuses.FINISHED:
        return (
          <button
            onClick={this.downloadReport}
            className="btn--white"
          >
            Download report
          </button>
        );
      default:
        return (
          <button
            onClick={this.onRunReport}
            className="btn--white"
          >
            Run report
          </button>
        );
    }
  };

  getReportContent = tableHeader => {
    const { accounts } = this.state;
    return (
      <div className="table-list">
        <div className="table-list__wrapper">
          <div className="table-container">
            <div className="table-row">
              {tableHeader.map(function(header, index) {
                return index == 0 ? (
                  <div className="table-header truncate text-left table-field table-field--fixed text-light-grey">
                    {header}
                  </div>
                ) : typeof header == "object" ? (
                  <div
                    key={index}
                    className="table-header text-center table-field text-light-grey"
                  >
                    {header.map(insurances => {
                      return _.map(insurances, (value, key) => {
                        if (value) {
                          return (
                            <div
                              style={{
                                width: "32%",
                                float: "left",
                                borderRight: "1px #d7d7d7 solid"
                              }}
                            >
                              {key}
                            </div>
                          );
                        }
                      });
                    })}
                  </div>
                ) : (
                  <div
                    key={index}
                    className="table-header text-center table-field text-light-grey"
                  >
                    {header}
                  </div>
                );
              })}
            </div>

            {accounts.map((account, index) => {
              return (
                <div className="table-row" key={index}>
                  <div className="table-field table-field--fixed truncate text-center">
                    {"Account No." + (index + 1)}
                  </div>
                  {tableHeader.map((content, index) => {
                    if (index > 0) {
                      return typeof content == "object" ? (
                        <div className="table-field table-field--grey text-center">
                          {content.map((insurances, i) => {
                            return _.map(insurances, (value, key) => {
                              if (value) {
                                return (
                                  <div
                                    style={{
                                      width: "32%",
                                      float: "left",
                                      borderRight: "1px #d7d7d7 solid"
                                    }}
                                  >
                                    {account.insurances[i] &&
                                      account.insurances[i][key]}
                                  </div>
                                );
                              }
                            });
                          })}
                        </div>
                      ) : (
                        <div className="table-field table-field--grey text-center">
                          {typeof account[content] === "object"
                            ? moment(account[content]).format(
                                "MM/DD/YYYY, hh:mm"
                              )
                            : account[content]}
                        </div>
                      );
                    }
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  copyReport = () => {
    const { closeRightPanel, report } = this.props;
    const { _id } = report;
    this.setState({ dialogIsActive: false });
    Meteor.call("report.copy", _id, err => {
      if (!err) {
        Notifier.success("Report created");
      } else {
        Notifier.error(err.reason);
      }
      closeRightPanel();
    });
  };

  render() {
    const { report, data } = this.props;
    const {
      schedule,
      accounts,
      loading,
      dialogIsActive,
      selectedReportColumns
    } = this.state;
    const job = data;
    const tableHeader = ["Account name", ...selectedReportColumns];

    return (
      <div className="main-content report-content">
        {schedule ? (
          <ScheduleBlock report={report} />
        ) : (
          <div className="main-content__header header-block header-reports">
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
                {Meteor.userId() !== report.authorId && (
                  <button className="btn--white" onClick={this.openDialog}>
                    Copy Report
                  </button>
                )}
                <button className="btn--white" onClick={this.openSchedule}>
                  Schedule
                </button>
                <button onClick={this.onEdit} className="btn--white">
                  Edit report
                </button>
                {this.getRunButton(job && job.status)}
              </div>
            </div>
            {dialogIsActive && (
              <Dialog
                className="account-dialog"
                title="Confirm"
                closePortal={this.closeDialog}
              >
                <div className="form-wrapper">
                  Are you sure you want to copy this report ?
                </div>
                <div className="btn-group">
                  <button className="btn-cancel" onClick={this.closeDialog}>
                    Cancel
                  </button>
                  <button className="btn--light-blue" onClick={this.copyReport}>
                    Confirm & copy
                  </button>
                </div>
              </Dialog>
            )}
          </div>
        )}
        {!schedule &&
          (loading ? <Loading /> : this.getReportContent(tableHeader))}
      </div>
    );
  }
}

export default withQuery(
  props => {
    return jobQueueQuery.clone({ filters: { reportId: props.report._id } });
  },
  { single: true, reactive: true }
)(ReportHeader);
