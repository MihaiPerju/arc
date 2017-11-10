import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/tasks/queries/taskList';
import TaskList from './components/TaskList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'
import autoBind from 'react-autobind'
import UserRoles from '/imports/api/users/enums/roles';
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
            const {facility, assignee} = task;

            //get facility options
            facilities.push({
                value: facility._id,
                label: facility.name
            });

            if (assignee) {
                const {profile} = assignee;
                //get assignee options
                assignees.push({
                    label: profile.firstName + profile.lastName,
                    value: assignee._id
                });
            }
        }
        return [facilities, assignees];
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

    isAdminOrTech() {
        return Roles.userIsInRole(Meteor.userId(), [UserRoles.ADMIN, UserRoles.TECH]);
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
                    {
                        this.isAdminOrTech() && <SelectField name="assigneeId" options={assignees}/>
                    }

                    <AutoField name="clientName"/>

                    <Divider/>
                </AutoForm>

                {/*<Input label="Search by patient name" onChange={this.searchByPatient}/>*/}
                <div>
                    {this.getPaginator()}
                    <TaskListCont params={params}/>
                    {this.getPaginator()}
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