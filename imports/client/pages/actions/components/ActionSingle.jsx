import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import autoBind from 'react-autobind';
import {Table} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'

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
                <Table.Cell>{action.state}</Table.Cell>
                <Table.Cell>
                    <Button.Group>
                        <Button onClick={this.onEditAction}>Edit</Button>      
                        <Button color="red" onClick={this.deleteAction}>Delete</Button>                                          
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}
