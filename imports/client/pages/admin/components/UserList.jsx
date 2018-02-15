import React, {Component} from 'react';
import UserSingle from './UserSingle';

export default class UserList extends Component {
    render() {
    	const imgPath = '/assets/img/';
    	const users = [
			{ mail: 'contomestchii@email', avatar: imgPath + 'user.svg' },
			{ mail: 'martin@email', avatar: imgPath + 'user1.svg' },
    	];
		const userList = users.map(function(user, index){
			const { renderContent, showBtnGroup } = this.props;
			return (
				<UserSingle
					key={index}
					id={index}
					renderContent={renderContent}
					showBtnGroup={showBtnGroup}
					mail={user.mail}
					avatar={user.avatar}
				/>
			)
		}, this);

        return (
            <div className={this.props.class}>
                { userList }
            </div>
        );
    }
}
