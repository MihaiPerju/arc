import React, {Component} from 'react';
import _ from 'underscore';
import TaskSingle from './TaskSingle.jsx';
import {Icon, Label, Menu, Table} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'

export default class TaskList extends Component {
    render() {
        const {data, loading, error} = this.props;

        if (loading) {
            return <div>Loading</div>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }

        return (
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Id</Table.HeaderCell>
                        <Table.HeaderCell>Pacient Name</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell>Assignee</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(data, (task) => {
                        return <TaskSingle task={task} key={task && task._id}/>;
                    })}
                </Table.Body>
            </Table>
        );
    }
}