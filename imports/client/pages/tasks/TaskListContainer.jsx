import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/tasks/queries/taskList';
import TaskList from './components/TaskList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'

export default class TaskListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 3,
            filters: {}
        });

        this.query = query.clone();
        this.TaskListCont = createQueryContainer(this.query, TaskList, {
            reactive: false
        })
    }

    render() {
        const params = _.extend({}, this.getPagerOptions());
        const TaskListCont = this.TaskListCont;

        return (
            <Container className="page-container">
                <div>
                    <Header as="h2" textAlign="center">Tasks</Header>
                </div>
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