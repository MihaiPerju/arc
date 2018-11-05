import React, { Component } from "react";
import ReportEdit from "./ReportEdit";
import ReportHeader from "./components/ReportContent/ReportHeader";
import ReportGraph from "./components/ReportContent/ReportGraph";

export default class ReportContent extends Component {
  constructor() {
    super();
    this.state = {
      edit: false,
      isGraph: false
    };
  }

  componentWillReceiveProps() {
    this.setState({ edit: false });
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
    const { edit, isGraph } = this.state;
    const { report, substates, closeRightPanel } = this.props;

    if (!report) {
      return (
        <div className="report-section">
          The report doesn't exist or was removed
        </div>
      );
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
