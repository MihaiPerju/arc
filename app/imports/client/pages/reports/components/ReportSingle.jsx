import React, { Component } from "react";
import classNames from "classnames";
import Notifier from "/imports/client/lib/Notifier";
import TagItem from "/imports/client/lib/TagItem";

export default class ReportSingle extends Component {
  constructor(props) {
    super(props);
  }

  onSetReport() {
    const { report, setReport } = this.props;
    setReport(report._id);
  }

  onSelectReport(e) {
    e.stopPropagation();
    const { report, selectReport } = this.props;
    selectReport(report._id);
  }

  onSubmitTags = data => {
    const { _id } = this.props.report;
    Object.assign(data, { _id });

    Meteor.call("report.tag", data, err => {
      if (!err) {
        Notifier.success("Tagged successfully");
      } else {
        Notifier.error(err.error);
      }
    });
  };

  render() {
    const { report, reportsSelected, currentReport, moduleTags } = this.props;
    const checked = reportsSelected.includes(report._id);
    const classes = classNames({
      "list-item": true,
      "bg--yellow": checked,
      open: currentReport === report._id
    });

    return (
      <div className={classes} onClick={this.onSetReport.bind(this)}>
        <div className="check-item">
          <input checked={checked} type="checkbox" className="hidden" />
          <label onClick={this.onSelectReport.bind(this)} />
        </div>
        <div className="row__item margin-top-10">
          <div className="item-name">{report.name}</div>
        </div>
        <div className="row__item margin-top-10">
          <TagItem
            title="Tag Report"
            tagIds={report.tagIds}
            moduleTags={moduleTags}
            onSubmitTags={this.onSubmitTags.bind(this)}
          />
        </div>
      </div>
    );
  }
}
