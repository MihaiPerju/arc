import React, {Component} from 'react';

export default class ReportHeader extends Component {
    render() {
        const {report, schedule} = this.props;
        return (
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
                        <button className="btn--white" onClick={schedule}>Schedule</button>
                        <button className="btn--white">Edit report</button>
                    </div>
                </div>
            </div>
        )
    }
}