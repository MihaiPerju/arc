import React, { Component } from "react";
import ScheduleBlock from "./../../ScheduleBlock.jsx";
import Notifier from "../../../../lib/Notifier";
import accountsQuery from "/imports/api/accounts/queries/accountList";
import moment from "moment/moment";
import JobQueueEnum from "/imports/api/jobQueue/enums/jobQueueTypes";
import JobQueueStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import jobQueueQuery from "/imports/api/jobQueue/queries/listJobQueues";
import { EJSON } from "meteor/ejson";
import Loading from "/imports/client/lib/ui/Loading";
import Dialog from "/imports/client/lib/ui/Dialog";

class ReportHeader extends Component {
  constructor() {
    super();
    this.state = {
      schedule: false,
      accounts: [],
      dialogIsActive: false
    };
  }

  componentWillMount() {
    this.getAccounts(this.props);
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
    const { reportId, _id } = data[0];
    window.open("/report/" + reportId);
  };

  getRunButton = status => {
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

                  <div className="table-field table-field--grey text-center">
                    {account.acctNum}
                  </div>
                  <div className="table-field table-field--grey text-center">
                    {moment(account.dischrgDate).format("MM/DD/YYYY hh:mm")}
                  </div>
                  <div className="table-field table-field--grey text-center">
                    {account.ptType}
                  </div>
                  <div className="table-field table-field--grey text-center">
                    {account.facCode}
                  </div>
                  <div className="table-field table-field--grey text-center">
                    {account.ptName}
                  </div>
                  <div className="table-field table-field--grey text-center">
                    {moment(account.fbDate).format("MM/DD/YYYY hh:mm")}
                  </div>
                  <div className="table-field table-field--grey text-center">
                    {account.acctBal}
                  </div>
                  <div className="table-field table-field--grey text-center">
                    {account.finClass}
                  </div>
                  <div className="table-field table-field--grey text-center">
                    {moment(account.admitDate).format("MM/DD/YYYY hh:mm")}
                  </div>
                  <div className="table-field table-field--grey text-center">
                    {account.medNo}
                  </div>
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
    const { schedule, accounts, loading, dialogIsActive } = this.state;
    const job = data;

    const tableHeader = [
      "Account name",
      "Account number",
      "Discharge date",
      "Patient Type",
      "Facility Code",
      "Patient Name",
      "Last Bill Date",
      "Account Balance",
      "Financial Class",
      "Admit Date",
      "Medical Number"
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
                {Meteor.userId() !== report.createdBy && (
                  <button className="btn--white" onClick={this.openDialog}>
                    Copy this report
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
              <Dialog className="account-dialog" closePortal={this.closeDialog}>
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
