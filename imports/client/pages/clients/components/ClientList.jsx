import React, {Component} from 'react';
import ClientSingle from './ClientSingle';

export default class ClientList extends Component {
    render() {
        const imgPath = '/assets/img/';
        const {clients} = this.props;
        const clientList = clients.map(function (client, index) {
            const {renderContent, showBtnGroup} = this.props;
            return (
                <ClientSingle
                    key={index}
                    renderContent={renderContent}
                    showBtnGroup={showBtnGroup}
                    id={index}
                    name={client.clientName}
                    mail={client.email}
                    avatar={client.avatar}
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
