import React, { Component } from "react";
import UserContentHeader from "./components/UserContentHeader";
import EditUser from "./EditUser";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class UserContent extends Component {
  constructor() {
    super();
    this.state = {
      edit: false,
    };
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.pollingMethod = setInterval(() => {
      this.getUser();
    }, 3000);
  }

  getUser() {
    const { currentUser } = this.props;

    Meteor.call("user.getOne", currentUser, (err, user) => {
      if (!err) {
        this.setState({ user });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  componentWillUnmount = () => {
    //Removing Interval
    clearInterval(this.pollingMethod);
  };

  setEdit = () => {
    const { edit } = this.state;
    this.setState({ edit: !edit });
  };

  render() {
    const { edit, user } = this.state;
    if (!user) {
      return <Loading />;
    }
    return (
      <div className="main-content user-content">
        {edit ? (
          <EditUser setEdit={this.setEdit} user={user} />
        ) : (
          <UserContentHeader setEdit={this.setEdit} user={user} />
        )}
      </div>
    );
  }
}
