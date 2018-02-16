import React, {Component} from 'react';
import ClientSingle from './ClientSingle';

export default class ClientList extends Component {
    render() {
    	const imgPath = '/assets/img/';
    	const clients = [
			{ name: 'Solomon Ben', mail: 'contact@email' , avatar: imgPath + 'user.svg' },
			{ name: 'Martinello Trello', mail: 'contact@email' , avatar: imgPath + 'user1.svg' },
			{ name: 'Hannah Wants', mail: 'contact@email' , avatar: imgPath + 'user2.svg' }
    	];
    	const clientList = clients.map(function(client, index){
    		const { renderContent, showBtnGroup } = this.props;
			return (
				<ClientSingle
					key={index}
					renderContent={renderContent}
					showBtnGroup={showBtnGroup}
					id={index}
					name={client.name}
					mail={client.mail}
					avatar={client.avatar}
				/>
			)
    	}, this);
        return (
            <div className={this.props.class}>
                { clientList }
            </div>
        );
    }
}
