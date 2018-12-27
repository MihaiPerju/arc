import React, { Component } from "react";
import ReportEdit from "./ReportEdit";
import ReportHeader from "./components/ReportContent/ReportHeader";
import ReportGraph from "./components/ReportContent/ReportGraph";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class ReportContent extends Component {
  constructor() {
    super();
    this.state = {
      edit: false,
      isGraph: false,
      report: null
    };
  }

  componentWillMount() {
    this.getReport(this.props.currentReport);
  }

  getReport(currentReport) {
    Meteor.call("report.getOne", currentReport, (err, report) => {
      if (!err) {
        this.setState({ report });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  // If account changed we need to go fetch it right away
  componentWillReceiveProps(nextProps) {
    if(nextProps.currentReport === this.props.currentReport)
      return;

    this.setState({edit: false, isGraph: false, report: null});
    this.getReport(nextProps.currentReport);
  }

  setEdit = () => {
    const { edit } = this.state;
    this.setState({ edit: !edit });
  };

  setGraph = () => {
    const { isGraph } = this.state;
    this.setState({
      isGraph: !isGraph
    });
  };

  render() {
    const { edit, isGraph, report } = this.state;
    const { substates, closeRightPanel } = this.props;

    if (!report) {
      return <Loading />;
    }

    return (
      <div className="report-section">
        {edit ? (
          <ReportEdit
            substates={substates}
            setEdit={this.setEdit}
            report={report}
            setGraph={this.setGraph}
          />
        ) : isGraph ? (
          <ReportGraph setGraph={this.setGraph} report={report} />
        ) : (
          <ReportHeader
            closeRightPanel={closeRightPanel}
            setEdit={this.setEdit}
            report={report}
            setGraph={this.setGraph}
          />
        )}
      </div>
    );
  }
}
