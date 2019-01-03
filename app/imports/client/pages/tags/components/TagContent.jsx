import React, { Component } from "react";
import TagContentHeader from "./TagContentHeader";
import TagEdit from "../TagEdit";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class TagContent extends Component {
  constructor() {
    super();
    this.state = {
      edit: false,
      clientOptions: [],
      users: []
    };
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.getData();
    this.pollingMethod = setInterval(() => {
      this.getData();
    }, 3000);
  }

  getData() {
    const { currentTag } = this.props;
    Meteor.call("tag.getOne", currentTag, (err, tag) => {
      if (!err) {
        this.setState({ tag });
      } else {
        Notifier.error(err.reason);
      }
    });

    Meteor.call("users.get", { roles: { $in: ["rep"] } }, (err, users) => {
      if (!err) {
        this.setState({ users });
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

  sortUsers = () => {
    const taggedUsers = [],
      untaggedUsers = [];
    const { tag, users } = this.state;
    _.map(users, user => {
      const index = user.tagIds ? user.tagIds.indexOf(tag && tag._id) : -1;
      if (index > -1) {
        taggedUsers.push(user);
      } else {
        untaggedUsers.push(user);
      }
    });
    return { taggedUsers, untaggedUsers };
  };

  render() {
    const { tag, edit } = this.state;

    if (!tag) {
      return <Loading />;
    }
    return (
      <div className="main-content tag-content">
        {edit ? (
          <TagEdit setEdit={this.setEdit} tag={tag} />
        ) : (
          <div>
            <TagContentHeader setEdit={this.setEdit} tag={tag} />
          </div>
        )}
      </div>
    );
  }
}
