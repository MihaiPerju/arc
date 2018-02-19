import React, {Component} from 'react';
import TaskSingle from './TaskSingle.jsx';
import _ from "underscore";

export default class TaskList extends Component {
    constructor(props) {
        super(props);
    }

    taskIsActive(task) {
        const {tasksSelected} = this.props;
        return _.includes(tasksSelected, task._id);
    }

    render() {
        const {data, loading, error, checkTask, selectTask, currentTask} = this.props;

        if (loading) {
            return <div>Loading</div>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }
        return (
            <div className={this.props.class}>
                {
                    data &&
                    data.length
                        ?
                        _.map(data, (task) => {
                            return <TaskSingle active={this.taskIsActive(task)}
                                               currentTask={currentTask}
                                               selectTask={selectTask}
                                               checkTask={checkTask}
                                               key={task._id}
                                               task={task}/>
                        })
                        :
                        "No tasks. To be replaced by designer"
                }
            </div>
        );
    }
}