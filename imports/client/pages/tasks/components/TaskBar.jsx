import React, {Component} from 'react';

export default class TaskBar extends Component {
	render() {
		return (
			<div className="task-bar">
				<div className="select-type">
					<div className="btn-select"></div>
				</div>
				<div className="btn-group">
					<button><i className="icon-archive"/></button>
					<button><i className="icon-trash-o"/></button>
				</div>
				<form action="" className="search-task">
					<div className="form-group">
						<input type="text" placeholder="&#xf002;  Search" />
					</div>
				</form>
				<div className="filter-block">
					<button><i className="icon-filter"/></button>
				</div>
			</div>
		)
	}
}