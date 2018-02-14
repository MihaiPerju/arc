import React, {Component} from 'react';
import UserSingle from './UserSingle';

export default class UserList extends Component {
    render() {
        return (
            <div className={this.props.class}>
                <UserSingle renderContent={this.props.renderContent} showBtnGroup={this.props.showBtnGroup}/>
            </div>
        );
    }
}
