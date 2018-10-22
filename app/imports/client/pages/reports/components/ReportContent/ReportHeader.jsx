import React, { Component } from "react";
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
import accountActionsQuery from "/imports/api/accountActions/queries/accountActionList";
import { reportTypes } from "/imports/client/pages/reports/enums/reportType";
import AccountActionContent from "./AccountActionContent";
import AccountContent from "./AccountContent";
import ActionDropdown from "./ActionDropdown";

class ReportHeader extends Component {
  constructor() {
    super();
    this.state = {
      schedule: false,
      accounts: [],
      dialogIsActive: false,
      selectedReportColumns: [],
      accountActions: [],
      isDisabled: false
    };
  }

  componentWillMount() {
    this.getAccounts(this.props);
  }

  componentWillReceiveProps(props) {
    this.getAccounts(props);
    const { report } = props;
    const { reportColumns } = report;
    const selectedReportColumns = [];

    for (let key in reportColumns) {
      if (reportColumns[key]) {
        selectedReportColumns.push(key);
      }
    }

    this.setState({
      selectedReportColumns
    });
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
    if (report.type === reportTypes.ACCOUNT_ACTIONS) {
      accountActionsQuery
        .clone({ filters, options })
        .fetch((err, accountActions) => {
          if (!err) {
            this.setState({
              accountActions,
              loading: false
            });
          } else {
            Notifier.error("Couldn't get sample account actions");
          }
        });
    } else {
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
    this.setState({ isDisabled: true });
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
        this.setState({ isDisabled: false });
      }
    );
  };

  downloadReport = () => {
    const { data } = this.props;
    const { reportId } = data[0];
    window.open("/report/" + reportId);
  };

  downloadReportpdf = () => {
    const { data } = this.props;
    const { reportId } = data[0];
    window.open("/reportpdf/" + reportId);
  }

  getRunButton = status => {
    const { isDisabled } = this.state;
    switch (status) {
      case JobQueueStatuses.IN_PROGRESS:
        return (
          <li className="action-item">
            <a href="javascript:;">Running...</a>
          </li>
        );
      case JobQueueStatuses.FINISHED:
        return (
          <ul>
            <li className="action-item">
              <a href="javascript:;" onClick={this.downloadReport}>
                Download report csv
            </a>
            </li>
            <li className="action-item">
              <a href="javascript:;" onClick={this.downloadReportpdf}>
                Download report pdf
            </a>
            </li>
            <li className="action-item">
              <a
                style={isDisabled ? { pointerEvents: "none" } : {}}
                href="javascript:;"
                onClick={this.onRunReport}
              >
                Run report (again)
            </a>
            </li>
          </ul>
        );
      default:
        return (
          <li className="action-item">
            <a
              style={isDisabled ? { pointerEvents: "none" } : {}}
              href="javascript:;"
              onClick={this.onRunReport}
            >
              Run report
            </a>
          </li>
        );
    }
  };

  getReportContent = tableHeader => {
    const { accounts, accountActions } = this.state;
    const { report } = this.props;
    return (
      <div className="table-list">
        <div className="table-list__wrapper">
          {report.type === reportTypes.ACCOUNTS ? (
            <AccountContent
              report={report}
              tableHeader={tableHeader}
              accounts={accounts}
            />
          ) : (
              <AccountActionContent
                tableHeader={tableHeader}
                accountActions={accountActions}
              />
            )}
        </div>
      </div>
    );
  };

  copyReport = () => {
    const { closeRightPanel, report } = this.props;
    const { _id } = report;
    this.setState({ dialogIsActive: false, isDisabled: true });
    Meteor.call("report.copy", _id, err => {
      if (!err) {
        Notifier.success("Report created");
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
      closeRightPanel();
    });
  };

  onSetGraph = () => {
    const { setGraph } = this.props;
    setGraph();
  };

  render() {
    const { report, data } = this.props;
    const {
      schedule,
      loading,
      dialogIsActive,
      selectedReportColumns,
      isDisabled
    } = this.state;
    const job = data[data.length - 1];
    let tableHeader = [];
    if (report.type === reportTypes.ACCOUNT_ACTIONS) {
      tableHeader = [
        "accountId",
        "type",
        "userId",
        "createdAt",
        "actionId",
        "reasonCode",
        "customFields"
      ];
    } else {
      tableHeader = [...selectedReportColumns];
    }

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
                <div className="placement-block">
                  <div className="text-light-grey">Placement date</div>
                  <div className="time">11:20</div>
                </div>
                <ActionDropdown
                  openDialog={this.openDialog}
                  openSchedule={this.openSchedule}
                  onEdit={this.onEdit}
                  onSetGraph={this.onSetGraph.bind(this)}
                >
                  {Meteor.userId() !== report.authorId && (
                    <li className="action-item">
                      <a href="javascript:;" onClick={this.openDialog}>
                        Copy Report
                    </a>
                    </li>
                  )}
                  {this.getRunButton(job && job.status)}
                </ActionDropdown>
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
                    <button
                      style={isDisabled ? { cursor: "not-allowed" } : {}}
                      disabled={isDisabled}
                      className="btn--light-blue"
                      onClick={this.copyReport}
                    >
                      {isDisabled ? (
                        <div>
                          {" "}
                          Loading
                        <i className="icon-cog" />
                        </div>
                      ) : (
                          "Confirm & Copy"
                        )}
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
  { reactive: true }
)(ReportHeader);
