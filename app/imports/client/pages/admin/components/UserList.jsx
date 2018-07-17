import React, { Component } from "react";
import UserSingle from "./UserSingle";

export default class UserList extends Component {
  render() {
    const { users } = this.props;
    const userList = users.map(function(user, index) {
      const { currentUser, setUser, selectUser, usersSelected } = this.props;
      return (
        <UserSingle
          open={currentUser === user._id}
          usersSelected={usersSelected}
          currentUser={currentUser}
          selectUser={selectUser}
          setUser={setUser}
          key={user._id}
          user={user}
        />
      );
    }, this);

    return <div className={this.props.class}>{userList}</div>;
  }
}
