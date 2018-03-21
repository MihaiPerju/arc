import React, {Component} from 'react'
import TaskList from './components/TaskList.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import TaskContent from './TaskContent.jsx';
import Pager from '/imports/client/lib/Pager.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import query from '/imports/api/tasks/queries/taskList';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import Loading from '/imports/client/lib/ui/Loading';
import PagerService from '/imports/client/lib/PagerService';

class TaskListContainer extends Pager {
    constructor() {
        super();
        _.extend(this.state, {
            dialogIsActive: false,
            tasksSelected: [],
            currentTask: null,
            page: 1,
            perPage: 13,
            total: 0,
            range: {}
        });
        this.query = query;
    }

    componentWillMount() {
        this.nextPage(0);
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

    selectTask = (newTask) => {
        const {currentTask} = this.state;
        if (currentTask === newTask._id) {
            this.setState({currentTask: null})
        } else {
            this.setState({currentTask: newTask._id});
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

    decreaseList = () => {
        this.setState({
            filter: !this.state.filter
        })
    }

    getTask(currentTask) {
        const {data} = this.props;
        for (task of data) {
            if (task._id == currentTask)
                return task;
        }
        return null;
    }

    nextPage = (inc) => {
        const {perPage, total, page} = this.state;
        const nextPage = PagerService.setPage({page, perPage, total}, inc);
        const range = PagerService.getRange(nextPage, perPage);
        FlowRouter.setQueryParams({page: nextPage});
        this.setState({range, page: nextPage, currentTask: null});
    };

    render() {
        const {data, loading, error} = this.props;
        const {tasksSelected, currentTask, range, total, filter} = this.state;
        const options = this.getData(data);
        const task = this.getTask(currentTask);

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }
        return (
            <div className="cc-container">
                <div className={currentTask ? "left__side" : "left__side full__width"}>
                    <SearchBar options={options}
                               changeFilters={this.changeFilters}
                               decrease={this.decreaseList}
                               btnGroup={tasksSelected.length}
                    />
                    <TaskList
                        classes={filter ? 'task-list decreased' : 'task-list'}
                        tasksSelected={tasksSelected}
                        selectTask={this.selectTask}
                        checkTask={this.checkTask}
                        currentTask={currentTask}
                        data={data}
                    />
                    <PaginationBar nextPage={this.nextPage}
                                   range={range}
                                   total={total}
                                   buttonHidden={true}/>
                </div>
                {
                    currentTask && <RightSide update={this.update} task={task}/>
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
    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;
    return PagerService.setQuery(query, {page, perPage});
}, {reactive: true})(TaskListContainer)