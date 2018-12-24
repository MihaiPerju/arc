import React, { Component } from "react";
import ScheduleBlock from "./../../ScheduleBlock.jsx";
import Notifier from "../../../../lib/Notifier";
import JobQueueEnum from "/imports/api/jobQueue/enums/jobQueueTypes";
import JobQueueStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";
import { EJSON } from "meteor/ejson";
import Loading from "/imports/client/lib/ui/Loading";
import Dialog from "/imports/client/lib/ui/Dialog";
import { reportTypes } from "/imports/client/pages/reports/enums/reportType";
import AccountActionContent from "./AccountActionContent";
import AccountContent from "./AccountContent";
import ActionDropdown from "./ActionDropdown";

export default class ReportHeader extends Component {
  constructor() {
    super();
    this.state = {
      schedule: false,
      accounts: [],
      dialogIsActive: false,
      selectedReportColumns: [],
      accountActions: [],
      isDisabled: false,
      isOpenedDropdown: false,
      reportId: null,
      mongoFilters: null
    };
    this.pollingMethod = null;
  }

  componentWillMount() {
    const { report } = this.props;
    const { _id } = report;
    this.setState({ reportId: _id });
    this.getAccounts(this.props);
    this.getColumns();

    this.pollingMethod = setInterval(() => {
      this.getLastJob();
    }, 5000);
  }

  getLastJob = () => {
    const { report } = this.props;

    Meteor.call("jobQueue.getLastJob", { reportId: report._id }, (err, job) => {
      if (!err) {
        this.setState({ job });
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  componentWillReceiveProps(props) {
    const { report } = props;
    const { _id, mongoFilters } = report;
    if (this.state.reportId !== _id) {
      this.setState({ reportId: _id });
      this.getColumns();
      this.getAccounts(props);
    }
    
    if(this.state.mongoFilters !== mongoFilters) {
      this.setState({mongoFilters});
      this.getColumns();
      this.getAccounts(props);
    }

  }

  getColumns() {
    const { reportColumns } = this.props.report;
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

  componentWillUnmount() {
    document.removeEventListener("click", this.outsideClick, false);
    //Removing Interval
    clearInterval(this.pollingMethod);
  }

  outsideClick = e => {
    if (this.node && this.node.contains(e.target)) {
      return;
    }

    this.openDropdown();
  };

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
    this.setState({ loading: true });
    if (report.type === reportTypes.ACCOUNT_ACTIONS) {
      Meteor.call(
        "accountActions.get",
        { filters, options },
        (err, accountActions) => {
          if (!err) {
            this.setState({
              accountActions,
              loading: false
            });
          } else {
            this.setState({ loading: false });
            Notifier.error("Couldn't get sample account actions");
          }
        }
      );
    } else {
      Meteor.call("accounts.getSample", filters, (err, accounts) => {
        if (!err) {
          this.setState({
            accounts,
            loading: false
          });
        } else {
          this.setState({ loading: false });
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
    this.setState({ isDisabled: true, isOpenedDropdown: false });
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
    const { job } = this.state;
    const { reportId } = job;
    window.open("/report/" + reportId);
  };

  downloadReportpdf = () => {
    const { job } = this.state;
    const { reportId } = job;
    window.open("/reportpdf/" + reportId);
  };

  renderRunReportButton = status => {
    const { isDisabled } = this.state;
    switch (status) {
      case JobQueueStatuses.IN_PROGRESS:
        return (
          <div className="action-dropdown p-0">
            <div
              className="action-dropdown__btn btn-disable-color"
              style={
                isDisabled
                  ? { pointerEvents: "none", width: 110 }
                  : { width: 110 }
              }
            >
              Running...
            </div>
          </div>
        );
      case JobQueueStatuses.FINISHED:
        return (
          <div className="action-dropdown">
            <div
              className="action-dropdown__btn"
              style={
                isDisabled
                  ? { pointerEvents: "none", width: 110 }
                  : { width: 110 }
              }
              onClick={this.openDropdown}
            >
              Run report
              <i className="icon-angle-down" />
            </div>
            {this.state.isOpenedDropdown && (
              <div className="action-dropdown__container">
                <div className="action-caret">
                  <div className="action-caret__outer" />
                  <div className="action-caret__inner" />
                </div>
                <ul className="action-list">
                  <li className="action-item">
                    <a
                      href="javascript:;"
                      onClick={this.onRunReport}
                      style={isDisabled ? { pointerEvents: "none" } : {}}
                    >
                      Run report (again)
                    </a>
                  </li>
                  <li className="action-item">
                    <a href="javascript:;" onClick={this.downloadReportpdf}>
                      Download report pdf
                    </a>
                  </li>
                  <li className="action-item">
                    <a href="javascript:;" onClick={this.downloadReport}>
                      Download report csv
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="action-dropdown">
            <div
              className="action-dropdown__btn"
              style={{ width: 110 }}
              onClick={this.onRunReport}
            >
              Run Report
            </div>
          </div>
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

  openDropdown = () => {
    const { isOpenedDropdown } = this.state;

    if (!isOpenedDropdown) {
      document.addEventListener("click", this.outsideClick, false);
    } else {
      document.removeEventListener("click", this.outsideClick, false);
    }

    this.setState({
      isOpenedDropdown: !isOpenedDropdown
    });
  };

  render() {
    const { report } = this.props;
    const {
      schedule,
      loading,
      dialogIsActive,
      selectedReportColumns,
      isDisabled,
      job
    } = this.state;
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
            <div className="row__header report-row-header">
              <div className="text-light-grey">Report name</div>
              <div className="title float-left">{report.name}</div>
              <div className="btn-run-report">
                {this.renderRunReportButton(job && job.status)}
                {job && job.status === JobQueueStatuses.FAILED && (
                  <div style={{ color: "red" }}>Report failed</div>
                )}
              </div>
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
