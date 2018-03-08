import React, {Component} from 'react';
import classNames from "classnames";

export default class ReportSingle extends Component {
    constructor(props) {
        super(props);
    }

    onSetReport() {
        const {report, setReport} = this.props;
        setReport(report._id);
    }

    onSelectReport(e) {
        e.stopPropagation();
        const {report, selectReport} = this.props;
        selectReport(report._id);
    }

    render() {
        const {report, reportsSelected, currentReport} = this.props;
        const checked = reportsSelected.includes(report._id);
        const classes = classNames({
            "list-item": true,
            "bg--yellow": checked,
            "open": currentReport === report._id
        });
        return (
            <div
                className={classes}
                onClick={this.onSetReport.bind(this)}>
                <div className="check-item">
                    <input checked={checked} type="checkbox" className="hidden"/>
                    <label onClick={this.onSelectReport.bind(this)}></label>
                </div>
                <div className="row__block align-center">
                    <div className="item-name">{report.name}</div>
                </div>
            </div>
        );
    }
}