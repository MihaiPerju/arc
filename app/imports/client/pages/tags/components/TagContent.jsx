import React, { Component } from "react";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import TagContentHeader from "./TagContentHeader";
import TagEdit from "../TagEdit";
import TagContentDescription from "./TagContentDescription";
import usersQuery from "/imports/api/users/queries/listUsers";
import { moduleNames } from "../enums/moduleList";

class TagContent extends Component {
  constructor() {
    super();
    this.state = {
      edit: false,
      clientOptions: []
    };
  }

  componentWillReceiveProps() {
    this.setState({ edit: false });
  }

  setEdit = () => {
    const { edit } = this.state;
    this.setState({ edit: !edit });
  };

  sortUsers = () => {
    const taggedUsers = [],
      untaggedUsers = [];
    const { tag, data: users } = this.props;
    _.map(users, user => {
      const index = user.tagIds ? user.tagIds.indexOf(tag._id) : -1;
      if (index > -1) {
        taggedUsers.push(user);
      } else {
        untaggedUsers.push(user);
      }
    });
    return { taggedUsers, untaggedUsers };
  };

  render() {
    const { edit } = this.state;
    const { tag, data: users, error } = this.props;
    console.log(tag);
    if (error) {
      return <div>Error: {error.reason}</div>;
    }

    const { taggedUsers, untaggedUsers } = this.sortUsers();

    return (
      <div className="main-content tag-content">
        {edit ? (
          <TagEdit setEdit={this.setEdit} tag={tag} />
        ) : (
          <div>
            <TagContentHeader setEdit={this.setEdit} tag={tag} />
            {tag &&
              tag.entities &&
              tag.entities.includes(moduleNames.USERS) && (
                <TagContentDescription
                  taggedUsers={taggedUsers}
                  untaggedUsers={untaggedUsers}
                  users={users}
                  currentTag={tag}
                />
              )}
          </div>
        )}
      </div>
    );
  }
}

export default withQuery(
  () => {
    const params = {
      filters: { roles: { $in: ["rep"] } }
    };
    return usersQuery.clone(params);
  },
  { reactive: true }
)(TagContent);
