import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import autoBind from 'react-autobind';

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
            <tr>
                <td>{client.clientName}</td>
                <td>{client.firstName}</td>
                <td>{client.lastName}</td>
                <td>{client.email}</td>
                <td>
                    <a onClick={this.onEditClient}>Edit Client</a>

                    <button onClick={this.deleteClient}>Delete</button>
                </td>
            </tr>
        );
    }
}