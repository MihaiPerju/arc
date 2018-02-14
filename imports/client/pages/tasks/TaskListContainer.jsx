import React, {Component} from 'react'
import TaskList from './components/TaskList.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import TaskContent from './TaskContent.jsx';
import FilterBar from '/imports/client/lib/FilterBar.jsx';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/tasks/queries/taskList';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'
import autoBind from 'react-autobind'
import {AutoForm, AutoField, ErrorField, SelectField} from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';

export default class TaskListContainer extends Component {
    constructor() {
        super();
        this.state = {
            rightSide: false,
            btnGroup: false,
            filter: false
        };

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
        const facilities = [];
        const assignees = [];
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
        return [facilities
            , assignees
        ];
    }

    render() {
        const {tasks, rightSide, filter, btnGroup} = this.state;
        const [facilities, assignees] = this.getData(tasks);
        // const params = _.extend({}, this.getPagerOptions());
        const TaskListCont = this.TaskListCont;

        return (
            <div className="cc-container">
                <div className={rightSide ? "left__side" : "left__side full__width"}>
                    <SearchBar btnGroup={btnGroup} filter={this.showFilterBar}/>
                    {filter ? <FilterBar/> : null}
                    <TaskListCont
                        class={filter ? "task-list decreased" : "task-list"}
                        renderContent={this.renderRightSide}
                        showBtnGroup={this.showBtnGroup}
                    />
                    <PaginationBar/>
                </div>
                {
                    rightSide ? (
                        <RightSide/>
                    ) : null
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
        return (
            <div className={fade ? "right__side in" : "right__side"}>
                <TaskContent/>
            </div>
        )
    }
}