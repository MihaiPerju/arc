import React, {Component} from 'react';
import {Table} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'

export default class TaskSingle extends Component {
    render() {
        const {task} = this.props;
        
        return (
            <Table.Row>
                <Table.Cell>{task._id}</Table.Cell>
                <Table.Cell>{task.acctNum.clientName}</Table.Cell>
                <Table.Cell>{task.state}</Table.Cell>
                <Table.Cell>
                    <Button href={"/task/" + task._id + '/view'} primary>View</Button>
                </Table.Cell>
            </Table.Row>
        );
    }
}