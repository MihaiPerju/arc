import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import autoBind from 'react-autobind';
import {Table} from 'semantic-ui-react'
import {Button, Dropdown} from 'semantic-ui-react'

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

    onViewClient() {
        FlowRouter.go("/client/:_id/view", {_id: this.props.client._id});
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
                    <Dropdown button text='Action' icon={null} simple>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Button primary
                                        onClick={() => {
                                            FlowRouter.go("region.list", {id: client._id})
                                        }}>
                                    Manage Regions
                                </Button>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Button primary
                                        onClick={() => {
                                            FlowRouter.go("facility.list", {_id: client._id})
                                        }}>
                                    Manage Facilities
                                </Button>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Button onClick={this.onViewClient}>View Client</Button>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Button onClick={this.onEditClient}>Edit Client</Button>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Button color="red" onClick={this.deleteClient}>Delete</Button>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
            </Table.Row>
        );
    }
}