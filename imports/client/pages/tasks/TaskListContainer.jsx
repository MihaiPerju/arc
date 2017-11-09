import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/tasks/queries/taskList';
import TaskList from './components/TaskList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'
import {Input} from 'semantic-ui-react'
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

    onHandleChange(field, value) {
        this.updateFilters({
            filters: {
                [field]: value
            }
        });
    }

    isAdminOrTech() {
        return Roles.userIsInRole(Meteor.userId(), [UserRoles.ADMIN, UserRoles.TECH]);
    }

    searchByPatient(e, {value}) {
        Meteor.call('client.getByName', value, (err, clients) => {
            if (!err) {
                const acctNums = [];
                for (let client of clients) {
                    acctNums.push(client._id);
                }
                this.updateFilters({
                    filters: {
                        acctNum: {
                            $in: acctNums
                        }
                    }
                })
            }
        })
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
                <AutoForm schema={schema} onChange={this.onHandleChange}>

                    <SelectField name="facilityId" options={facilities}/>
                    <ErrorField name="facilityId"/>

                    <SelectField name="assigneeId" options={assignees}/>
                    <ErrorField name="assigneeId"/>

                    <Divider/>
                </AutoForm>

                <Input label="Search by patient name" onChange={this.searchByPatient}/>
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
    }
});