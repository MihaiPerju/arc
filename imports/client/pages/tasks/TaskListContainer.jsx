import React, {Component} from 'react'
import TaskList from './components/TaskList.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import TaskContent from './TaskContent.jsx';
import Pager from '/imports/client/lib/Pager.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import autoBind from 'react-autobind'
import query from '/imports/api/tasks/queries/taskList';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import Loading from '/imports/client/lib/ui/Loading';

class TaskListContainer extends Pager {
    constructor() {
        super();
        _.extend(this.state, {
            perPage: 3,
            filters: {},
            tasks: [],
            rightSide: false,
            btnGroup: false,
            taskId: null,
            tasksSelected: []
        });

        this.query = query.clone();
        autoBind(this);

        this.renderRightSide = this.renderRightSide.bind(this);
        this.showBtnGroup = this.showBtnGroup.bind(this);
    }

    renderRightSide() {
        this.setState({
            rightSide: true
        })
    }

    showBtnGroup() {
        this.setState({
            btnGroup: !this.state.btnGroup
        })
    }

    getData(tasks) {
        let facilities = [];
        let assignees = [];
        if (tasks) {
            for (let task of tasks) {
                const {facility} = task;
                if (facility) {
                    let users = [];
                    if (facility) {
                        users = facility.users;
                    }
                    //get facility options
                    let item = {
                        key: facility._id,
                        value: facility._id,
                        label: facility.name
                    };
                    if (!_.findWhere(facilities, item)) {
                        facilities.push(item);
                    }

                    if (users) {
                        for (let user of users) {
                            const {profile} = user;

                            let item = {
                                key: user._id,
                                label: profile.firstName + ' ' + profile.lastName,
                                value: user._id
                            };
                            //get assignee options
                            if (!_.findWhere(assignees, item)) {
                                assignees.push(item);
                            }
                        }
                    }
                }
            }
        }
        return {facilities, assignees};
    }

    selectTask(newTask) {
        const {taskId} = this.state;
        if (taskId === newTask._id) {
            this.setState({taskId: null})
        } else {
            this.setState({taskId: newTask._id});
        }
    }

    checkTask(task) {
        const {tasksSelected} = this.state;
        if (tasksSelected.includes(task._id)) {
            tasksSelected.splice(tasksSelected.indexOf(task._id), 1);
        } else {
            tasksSelected.push(task._id);
        }
        this.setState({
            tasksSelected
        })
    }

    changeFilters(filters) {
        this.updateFilters({filters})
        this.setState({
            filter: !this.state.filter
        })
    }

    update() {
        const {refetch} = this.props;
        refetch();
    }

    getTask(taskId) {
        const {data} = this.props;
        for (task of data) {
            if (task._id == taskId)
                return task;
        }
        return null;
    }

    render() {
        const {data, loading, error} = this.props;
        const {tasks, filter, tasksSelected, taskId} = this.state;
        const options = this.getData(tasks);
        const task = this.getTask(taskId);
        // const params = _.extend({}, this.getPagerOptions());

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }
        return (
            <div className="cc-container">
                <div className={taskId ? "left__side" : "left__side full__width"}>
                    <SearchBar options={options}
                               changeFilters={this.changeFilters}
                               btnGroup={tasksSelected.length}
                    />
                    <TaskList
                        classes={filter ? "task-list decreased" : "task-list"}
                        renderContent={this.renderRightSide}
                        selectTask={this.selectTask}
                        tasksSelected={tasksSelected}
                        currentTask={taskId}
                        checkTask={this.checkTask}
                        data={data}
                    />
                    <PaginationBar noAddButton={true}/>
                </div>
                {
                    taskId && <RightSide update={this.update} task={task}/>
                }
            </div>
        );
    }
}

class RightSide extends Component {
    constructor() {
        super();
        this.state = {
            fade: false
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({fade: true});
        }, 300);
    }

    render() {
        const {fade} = this.state;
        const {task, update} = this.props;
        return (
            <div className={fade ? "right__side in" : "right__side"}>
                {
                    task ?
                        <TaskContent update={update} task={task}/>
                        :
                        'No component provided for bulk accounts'
                }
            </div>
        )
    }
}

export default withQuery((props) => {
    return query.clone();
})(TaskListContainer)