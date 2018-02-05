import React, {Component} from 'react';
import TaskContentHeader from './components/TaskContent/TaskContentHeader';

export default class TaskContent extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<div className="task-content">				
				<TaskContentHeader/>
			</div>
		)
	}
}