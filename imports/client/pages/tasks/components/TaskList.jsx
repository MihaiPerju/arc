import React, {Component} from 'react';
import TaskSingle from './TaskSingle.jsx';

export default class TaskList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="task-list">
                <TaskSingle renderContent={this.props.renderContent} showBtnGroup={this.props.showBtnGroup}/>
            </div>
        );
    }
}