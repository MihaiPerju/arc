import React, {Component} from 'react';
import {Table} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import AssigneeSelect from './AssigneeSelect';

export default class TaskSingle extends Component {
    constructor() {
        super();
    }

    getOptions(users) {
        let options = [];
        for (user of users) {
            let item = {
                label: user && user.profile && user.profile.firstName + ' ' + user.profile.lastName + '(' + user.roles[0] + ')',
                value: user && user._id
            };
            options.push(item);
        }
        return options;
    }

    getFirstOption(task, options) {
        if (task.assigneeId) {
            for (option of options) {
                if (option.value === task.assigneeId) {
                    return [option];
                }
            }
        }
        return [{label: 'Unassigned'}];
    }

    render() {
        const {task} = this.props;
        const options = this.getOptions(task && task.facility && task.facility.users);
        let userOptions = this.getFirstOption(task, options);
        userOptions = userOptions.concat(options);

        return (
            <Table.Row>
                <Table.Cell>{task && task._id}</Table.Cell>
                <Table.Cell>{task && task.client && task.client.clientName}</Table.Cell>
                <Table.Cell>{task && task.state}</Table.Cell>
                <Table.Cell>
                    <AssigneeSelect taskId={task && task._id} options={userOptions}/>
                </Table.Cell>
                <Table.Cell>
                    <Button href={"/task/" + task && task._id + '/view'} primary>View</Button>
                </Table.Cell>
            </Table.Row>
        );
    }
}