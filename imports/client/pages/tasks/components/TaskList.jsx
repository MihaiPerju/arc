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
        const {data, checkTask, selectTask, currentTask, classes} = this.props;

        return (
            <div className={classes}>
                {
                    data &&
                    data.length
                        ?
                        _.map(data, (task) => {
                            return <TaskSingle active={this.taskIsActive(task)}
                                               currentTask={currentTask}
                                               selectTask={selectTask}
                                               checkTask={checkTask}
                                               update={this.update}
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