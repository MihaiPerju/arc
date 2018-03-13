import React, {Component} from 'react';
import UserSingle from './UserSingle';

export default class UserList extends Component {
    render() {
        const {users} = this.props;
        console.log("We receive:");
        console.log(users);
        const {currentUser, setUser, selectUser, usersSelected} = this.props;

        const userList = users.map((user, index) => {
            return (
                <UserSingle
                    open={currentUser === user._id}
                    usersSelected={usersSelected}
                    currentUser={currentUser}
                    selectUser={selectUser}
                    setUser={setUser}
                    key={index}
                    user={user}
                />
            )
        }, this);

        return (
            <div className={this.props.class}>
                {userList}
            </div>
        );
    }
}
