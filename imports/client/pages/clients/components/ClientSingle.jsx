import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import autoBind from 'react-autobind';
import {Table} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'

export default class ClientSingle extends Component {

    constructor() {
        super();
        autoBind(this);
    }

    deleteClient() {
        Meteor.call('client.delete', this.props.client._id, (err) => {
            if (!err) {
                Notifier.success('Client deleted !');
                FlowRouter.reload();
            }
        });
    }

    onEditClient() {
        FlowRouter.go("/client/:_id/edit", {_id: this.props.client._id});
    }

    render() {
        const {client} = this.props;

        return (
            <Table.Row>
                <Table.Cell>{client.clientName}</Table.Cell>
                <Table.Cell>{client.firstName}</Table.Cell>
                <Table.Cell>{client.lastName}</Table.Cell>
                <Table.Cell>{client.email}</Table.Cell>
                <Table.Cell>
                    <Button.Group>
                        <Button primary
                                onClick={() => {
                                    FlowRouter.go("facility.list", {_id: client._id})
                                }}>
                            Manage Facilities
                        </Button>
                        <Button onClick={this.onEditClient}>Edit Client</Button>
                        <Button color="red" onClick={this.deleteClient}>Delete</Button>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}