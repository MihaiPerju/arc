import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/tasks/queries/taskList';
import TaskList from './components/TaskList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'
import autoBind from 'react-autobind'
import {AutoForm, AutoField, ErrorField, SelectField} from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';

export default class TaskListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 3,
            filters: {},
            tasks: []
        });

        this.query = query.clone();
        this.TaskListCont = createQueryContainer(this.query, TaskList, {
            reactive: false
        });

        autoBind(this);
    }

    componentWillMount() {
        query.fetch((err, tasks) => {
            this.setState({tasks});
        });
    }

    getData(tasks) {
        const facilities = [];
        const assignees = [];

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
        return [facilities
            , assignees
        ];
    }

    onHandleChange() {
        const newFilters = this.refs.filters.state.modelSync;

        if (!newFilters.facilityId) {
            delete newFilters.facilityId;
        }
        if (!newFilters.assigneeId) {
            delete newFilters.assigneeId;
        }
        if (!newFilters.clientName) {
            delete newFilters.clientName;
            this.updateFilters({
                filters: newFilters
            })
        } else {
            Meteor.call('client.getByName', newFilters.clientName, (err, clients) => {
                if (!err) {
                    const acctNums = [];
                    for (let client of clients) {
                        acctNums.push(client._id);
                    }
                    newFilters.acctNum = {$in: acctNums};
                    delete newFilters.clientName;
                    this.updateFilters({
                        filters: newFilters
                    })
                }
            })

        }
    }

    render() {
        const [facilities, assignees] = this.getData(this.state.tasks);
        const params = _.extend({}, this.getPagerOptions());
        const TaskListCont = this.TaskListCont;

        return (
            <Container className="page-container">
                <div>
                    <Header as="h2" textAlign="center">Tasks</Header>
                </div>
                <AutoForm ref="filters" schema={schema} onChange={this.onHandleChange}>

                    <SelectField name="facilityId" options={facilities}/>

                    <SelectField name="assigneeId" options={assignees}/>

                    <AutoField name="clientName"/>

                    <Divider/>
                </AutoForm>
                <div>
                    {this.getPaginator().props.totalItemsCount > this.state.perPage ? this.getPaginator() : ''}
                    <TaskListCont params={params}/>
                    {this.getPaginator().props.totalItemsCount > this.state.perPage ? this.getPaginator() : ''}
                </div>
                <Divider/>
            </Container>
        );
    }
}

const schema = new SimpleSchema({
    facilityId: {
        type: String,
        optional: true,
        label: 'Filter by facility'
    },
    assigneeId: {
        type: String,
        optional: true,
        label: 'Filter by assignee'
    },
    clientName: {
        type: String,
        optional: true,
        label: 'Search by patient name'
    }
});