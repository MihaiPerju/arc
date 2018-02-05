import React, {Component} from 'react';

export default class PaginationBar extends Component {
	render() {
		return (
			<div className="pagination-bar">
				<div className="pagination-bar__wrapper">
					<div className="left__side text-dark-grey">1-12 <span className="text-light-grey">of</span> 275</div>
					<div className="btn-group">
						<button className="btn-prev"><i className="icon-angle-left"/></button>
						<button className="btn-next"><i className="icon-angle-right"/></button>
					</div>
				</div>
			</div>
		)
	}
} 