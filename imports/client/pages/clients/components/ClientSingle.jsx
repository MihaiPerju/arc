import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';

export default class ClientSingle extends Component {
    deleteClient() {
        const {client} = this.props;

        Meteor.call('client.delete', client._id, (err) => {
            if (!err) {
                Notifier.success('Client deleted !');
                FlowRouter.reload();
            }
        });
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
                    <a href={"/client/" + client._id + "/edit"}>Edit Client</a>

                    <button onClick={this.deleteClient.bind(this)}>Delete</button>
                </td>
            </tr>
        );
    }
}