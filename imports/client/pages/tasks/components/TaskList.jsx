import React, {Component} from 'react';
import TaskSingle from './TaskSingle.jsx';
import _ from "underscore";

export default class TaskList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {data, loading, error, manageTask} = this.props;

        if (loading) {
            return <div>Loading</div>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }
        return (
            <div className={this.props.class}>
                {
                    data.length
                        ?
                        _.map(data, (task) => {
                            return <TaskSingle renderContent={this.props.renderContent}
                                               showBtnGroup={this.props.showBtnGroup}
                                               task={task} key={task._id}
                                               manageTask={manageTask}/>
                        })
                        :
                        "No tasks. To be replaced by designer"
                }
            </div>
        );
    }
}