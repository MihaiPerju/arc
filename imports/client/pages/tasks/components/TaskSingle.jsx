import React, {Component} from 'react';
import {Table} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'

export default class TaskSingle extends Component {
    render() {
        const {task} = this.props;
        console.log(task);
        return (
            <Table.Row>
                <Table.Cell>{task && task._id._str}</Table.Cell>
                <Table.Cell>{task && task.client.clientName}</Table.Cell>
                <Table.Cell>{task && task.state}</Table.Cell>
                <Table.Cell>Let's assign smth</Table.Cell>
                <Table.Cell>
                    <Button href={"/task/" + task && task._id + '/view'} primary>View</Button>
                </Table.Cell>
            </Table.Row>
        );
    }
}