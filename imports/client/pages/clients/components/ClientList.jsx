import React, {Component} from 'react';
import ClientSingle from './ClientSingle';

export default class ClientList extends Component {
    render() {
        const {clients} = this.props;
        const clientList = clients.map(function (client, index) {
            const {renderContent, showBtnGroup, selectClient} = this.props;
            return (
                <ClientSingle
                    renderContent={renderContent}
                    selectClient={selectClient}
                    showBtnGroup={showBtnGroup}
                    name={client.clientName}
                    avatar={client.logoPath}
                    mail={client.email}
                    key={index}
                    id={client._id}
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
