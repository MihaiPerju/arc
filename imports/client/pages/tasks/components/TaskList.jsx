import React, {Component} from 'react';
import TaskSingle from './TaskSingle.jsx';
import _ from "underscore";
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import query from '/imports/api/tasks/queries/taskList';
import Loading from '/imports/client/lib/ui/Loading';

class TaskList extends Component {
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
            return <Loading/>
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

export default withQuery((props) => {
    return query.clone();
})(TaskList)