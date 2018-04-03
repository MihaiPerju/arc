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
import AccountAssigning from '/imports/client/pages/tasks/components/TaskContent/AccountAssigning.jsx'
import AccountSearchBar from './components/AccountSearchBar';
import AccountMetaData from '/imports/client/pages/tasks/components/TaskContent/AccountMetaData'

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
            range: {},
            assignUser: false,
            assignWQ: false,
            showMetaData: false
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
            this.setState({
                currentTask: null,
                showMetaData: false
            })
        } else {
            this.setState({
                currentTask: newTask._id,
                showMetaData: false
            });
        }
    }

    checkTask = (task) => {
        const {tasksSelected} = this.state;
        if (tasksSelected.includes(task._id)) {
            tasksSelected.splice(tasksSelected.indexOf(task._id), 1);
        } else {
            tasksSelected.push(task._id);
        }
        this.setState({
            tasksSelected
        })
    };

    changeFilters(filters) {
        this.updateFilters({filters})

    }

    decreaseList = () => {
        this.setState({
            filter: !this.state.filter
        })
    };

    getFirstOption(tasks, options) {
        const commonAssigneeId = tasks[0].assigneeId;
        for (task of tasks) {
            if (task.assigneeId !== commonAssigneeId) {
                return [{label: 'Unassigned'}];
            }
        }
        for (let option of options) {
            if (option.value === commonAssigneeId) {
                return [option];
            }
        }
    }

    assignToUser = () => {
        const tasks = this.getTasks(this.state.tasksSelected);
        const options = this.getUserOptions(tasks);
        let userOptions = this.getFirstOption(tasks, options).concat(options);
        this.setState({
            assignUser: true,
            userOptions
        })

    };
    closeAssignUser = () => {
        this.setState({
            assignUser: false
        })

    };


    assignToWorkQueue = () => {
        this.setState({
            assignWQ: true
        })
    };

    closeAssignWQ = () => {
        this.setState({
            assignWQ: false
        })
    };

    getTask(currentTask) {
        const {data} = this.props;
        for (task of data) {
            if (task._id == currentTask)
                return task;
        }
        return null;
    }

    getTasks(tasksSelected) {
        const {data} = this.props;
        let tasks = [];
        for (task of data) {
            if (tasksSelected.includes(task._id))
                tasks.push(task);
        }
        return tasks;
    }

    getUserOptions(tasks) {
        let userOptions = [];
        for (task of tasks) {
            for (user of task.facility.users) {
                let item = {
                    label: user && user.profile && user.profile.firstName + ' ' + user.profile.lastName + '(' + user.roles[0] + ')',
                    value: user && user._id
                };
                if (!userOptions.includes(item)) {
                    userOptions.push(item);
                }
            }
        }
        return userOptions;
    }

    nextPage = (inc) => {
        const {perPage, total, page} = this.state;
        const nextPage = PagerService.setPage({page, perPage, total}, inc);
        const range = PagerService.getRange(nextPage, perPage);
        FlowRouter.setQueryParams({page: nextPage});
        this.setState({range, page: nextPage, currentTask: null});
    };

    getProperAccounts = (assign) => {
        FlowRouter.setQueryParams({assign});
    };

    openMetaDataSlider = () => {
        this.setState({
            showMetaData: true
        })
    };

    closeMetaDataSlider = () => {
        this.setState({
            showMetaData: false
        })
    };

    render() {
        const {data, loading, error} = this.props;
        const {tasksSelected, currentTask, range, total, filter, assignUser, assignWQ, showMetaData} = this.state;
        const options = this.getData(data);
        const task = this.getTask(currentTask);
        const dropdownOptions = [
            {label: 'All'},
            {label: 'Personal Accounts', filter: 'assigneeId'},
            {label: 'Work Queue Accounts', filter: 'workQueue'}
        ];
        const icons = [{icon: 'user', method: this.assignToUser}, {icon: 'users', method: this.assignToWorkQueue}];

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }
        return (
            <div className="cc-container">
                <div className={currentTask ? "left__side" : "left__side full__width"}>
                    <AccountSearchBar options={options}
                                      icons={icons}
                                      getProperAccounts={this.getProperAccounts}
                                      changeFilters={this.changeFilters}
                                      decrease={this.decreaseList}
                                      dropdownOptions={dropdownOptions}
                                      btnGroup={tasksSelected.length}
                    />
                    {
                        assignUser &&
                        <AccountAssigning
                            assignToUser={true}
                            accountIds={tasksSelected}
                            closeDialog={this.closeAssignUser}
                            title={''}
                            options={this.state.userOptions}
                        />
                    }
                    {
                        assignWQ &&
                        <AccountAssigning
                            assignToUser={false}
                            accountIds={tasksSelected}
                            closeDialog={this.closeAssignWQ}
                            title={''}
                        />
                    }
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
                    currentTask && !showMetaData &&
                    <RightSide update={this.update} task={task} openMetaData={this.openMetaDataSlider}/>
                }
                {
                    showMetaData && <MetaDataSlider task={task} closeMetaData={this.closeMetaDataSlider}/>
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
        const {task, update, openMetaData} = this.props;
        return (
            <div className={fade ? "right__side in" : "right__side"}>
                {
                    task ?
                        <TaskContent update={update} task={task} openMetaData={openMetaData}/>
                        :
                        'No component provided for bulk accounts'
                }
            </div>
        )
    }
}

class MetaDataSlider extends Component {
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

    closeSlider = () => {
        const {closeMetaData} = this.props;
        this.setState({fade: true});
        closeMetaData();
    }

    groupFields(fields) {
        const numInRow = 5;
        const numGroups = Math.ceil(fields.length / numInRow);
        let result = [];
        for (let i = 0; i < numGroups; i++) {
            const startIndex = i * numInRow;
            const finishIndex = Math.min((i + 1) * numInRow, fields.length);
            const groupOfFields = fields.slice(startIndex, finishIndex);
            result.push(groupOfFields);
        }
        return result;
    }

    render() {
        const {fade} = this.state;
        const {task} = this.props;
        const {metaData} = task;
        const metaDataGroups = this.groupFields(Object.keys(metaData));
        return (
            <div className={fade ? "right__side in" : "right__side"}>
                <div className="create-form__bar">
                    <div className="btn-group">
                        <button onClick={this.closeSlider} className="btn-cancel">Back</button>
                    </div>
                </div>
                {
                    task &&
                    <AccountMetaData close={this.closeSlider} metaData={task.metaData} metaDataGroups={metaDataGroups}/>
                }
            </div>
        )
    }
}

export default withQuery((props) => {
    const params = PagerService.getAccountQueryParams();
    return PagerService.setQuery(query, params);

}, {reactive: true})(TaskListContainer)