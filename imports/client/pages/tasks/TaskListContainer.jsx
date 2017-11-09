import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/tasks/queries/taskList';
import TaskList from './components/TaskList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'
import {Dropdown} from 'semantic-ui-react'
import autoBind from 'react-autobind'

export default class TaskListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 3,
            filters: {},
            facilities: []
        });

        this.query = query.clone();
        this.TaskListCont = createQueryContainer(this.query, TaskList, {
            reactive: false
        });

        autoBind(this);
    }

    componentWillMount() {
        const facilities = [];

        //Getting all facilities to which I have access
        query.fetch((err, tasks) => {
            for (let task of tasks) {
                const {facility} = task;
                facilities.push({
                    value: facility._id,
                    key: facility._id,
                    text: facility.name
                })
            }
        });

        this.setState({
            facilities
        })
    }

    handleSearch(e, data) {
        this.updateFilters({
            filters: {
                facilityId: data.value
            }
        })
    }

    render() {
        const {facilities} = this.state;
        const params = _.extend({}, this.getPagerOptions());
        const TaskListCont = this.TaskListCont;

        return (
            <Container className="page-container">
                <div>
                    <Header as="h2" textAlign="center">Tasks</Header>
                </div>
                <Container>
                    <Dropdown header="Search by facility"
                              onChange={this.handleSearch}
                              placeholder='Select facility'
                              fluid selection
                              options={facilities}/>
                </Container>
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