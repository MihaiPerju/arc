import React, {Component} from 'react'
import TaskList from './components/TaskList.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import TaskContent from './TaskContent.jsx';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/tasks/queries/taskList';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import autoBind from 'react-autobind'
import TaskService from './services/TaskService';

export default class TaskListContainer extends Pager {
    constructor() {
        super();
        this.state = {
            rightSide: true,
            btnGroup: false,
            filter: false,
            task: null,
            tasksSelected: []
        });

        this.query = query.clone();
        this.TaskListCont = createQueryContainer(this.query, TaskList, {
            reactive: false
        });

        autoBind(this);

        this.renderRightSide = this.renderRightSide.bind(this);
        this.showBtnGroup = this.showBtnGroup.bind(this);
        this.showFilterBar = this.showFilterBar.bind(this);
    }

    componentWillMount() {
        query.fetch((err, tasks) => {
            this.setState({tasks});
        });
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

    showFilterBar() {
        this.setState({
            filter: !this.state.filter
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
        return [facilities, assignees];
    }

    selectTask(newTask) {
        const {task} = this.state;
        if (JSON.stringify(task) === JSON.stringify(newTask)) {
            this.setState({task: null})
        } else {
            this.setState({task: newTask});
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
    }

    render() {
        const {tasks, filter, tasksSelected, task} = this.state;
        const [facilities, assignees] = this.getData(tasks);
        // const params = _.extend({}, this.getPagerOptions());
        const TaskListCont = this.TaskListCont;

        return (
            <div className="cc-container">
                <div className={task ? "left__side" : "left__side full__width"}>
                    <SearchBar btnGroup={tasksSelected.le
                    <TaskListCont
                        class={filter ? "task-list decreased" : "task-list"}
                        renderContent={this.renderRightSide}
                        selectTask={this.selectTask}
                        tasksSelected={tasksSelected}
                        currentTask={task && task._id}
                        checkTask={this.checkTask}
                    />
                    <PaginationBar/>
                </div>
                {
                    task && <RightSide task={task}/>
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
        const {task} = this.props;
        return (
            <div className={fade ? "right__side in" : "right__side"}>
                {
                    task ?
                        <TaskContent task={task}/>
                        :
                        'No component provided for bulk accounts'
                }
            </div>
        )
    }
}