import React, {Component} from 'react';

export default class ReportHeader extends Component {
	render() {
		return (
			<div className="header-block">
				<div className="row__header">
					<div className="text-light-grey">Report name</div>
					<div className="title">Report nr.11</div>
				</div>
				<div className="row__header">
					<div className="plasment-block">
						<div className="text-light-grey">Plasment date</div>
						<div className="time">11:20</div>
					</div>
					<div className="btn-group">
						<button className="btn--white">Schedule</button>
						<button className="btn--white">Edit report</button>
					</div>
				</div>
			</div>
		)
	}
}