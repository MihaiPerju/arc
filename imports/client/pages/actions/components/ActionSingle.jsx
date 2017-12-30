import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import autoBind from 'react-autobind';
import {Table, Dropdown} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import {LabelSubstates} from '/imports/api/tasks/enums/substates'

export default class ActionSingle extends Component {
    constructor() {
        super();
        autoBind(this);
    }

    deleteAction() {
        const {action} = this.props;

        Meteor.call('action.delete', action._id, (err)=> {
            if (!err) {
                Notifier.success('Action deleted !');
                FlowRouter.reload();
            }
        });
    }

    onEditAction() {
        FlowRouter.go("/action/:_id/edit", {_id: this.props.action._id});
    }
    render() {
        const {action} = this.props;

        return (
            <Table.Row>
                <Table.Cell>{action.title}</Table.Cell>
                <Table.Cell>{action.description}</Table.Cell>
                <Table.Cell>{LabelSubstates[action.substate]}</Table.Cell>
                <Table.Cell>
                    <Dropdown button text='Action' icon={null}>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Button onClick={this.onEditAction}>Edit</Button> 
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Button color="red" onClick={this.deleteAction}>Delete</Button>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
            </Table.Row>
        );
    }
}
