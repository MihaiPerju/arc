import React, {Component} from 'react';
import ClientSingle from './ClientSingle';

export default class ClientList extends Component {
    render() {
        const {clients, currentClient, renderContent, selectClient, setClient} = this.props;
        const clientList = clients.map(function (client, index) {
            return (
                <ClientSingle
                    currentClient={currentClient}
                    renderContent={renderContent}
                    selectClient={selectClient}
                    name={client.clientName}
                    avatar={client.logoPath}
                    setClient={setClient}
                    mail={client.email}
                    id={client._id}
                    key={client._id}
                />
            )
        }, this);
        return (
            <div className={this.props.class}>
                {clientList}
            </div>
        );
    }
}
