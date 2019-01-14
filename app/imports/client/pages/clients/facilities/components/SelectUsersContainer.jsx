import React from "react";
import UserRolesEnum from "/imports/api/users/enums/roles";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import { ErrorField } from "uniforms-unstyled";
import { Meteor } from "meteor/meteor";

export default class SelectUsersContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      users: []
    };
  }

  componentWillMount() {
    Meteor.call(
      "users.get",
      {
        roles: {
          $in: [UserRolesEnum.MANAGER, UserRolesEnum.REP]
        }
      },
      (err, users) => {
        if (!err) {
          this.setState({
            users
          });
        }
      }
    );
  }

  getUserOptions(users) {
    return _.map(users, ({ _id, profile, roles }) => {
      const value = `${profile.firstName} ${profile.lastName} (${roles[0]})`;
      return { value: _id, label: value };
    });
  }

  render() {
    const users = this.getUserOptions(this.state.users);

    return (
      <div className="select-group">
        <div className="form-wrapper">
          <SelectMulti
            
            placeholder="Allowed Users"
            name="allowedUsers"
            options={users}
          />
          <ErrorField name="allowedUsers" />
        </div>
      </div>
    );
  }
}
