import React, { Component } from "react";
import ReportSingle from "./ReportSingle";

export default class ReportList extends Component {
  render() {
    const { reports } = this.props;
    const reportList = reports.map(function(report) {
      const {
        setReport,
        selectReport,
        reportsSelected,
        currentReport,
        tags
      } = this.props;
      return (
        <ReportSingle
          reportsSelected={reportsSelected}
          currentReport={currentReport}
          selectReport={selectReport}
          setReport={setReport}
          report={report}
          key={report._id}
          tags={tags}
        />
      );
    }, this);

    return <div className={this.props.class}>{reportList}</div>;
  }
}
