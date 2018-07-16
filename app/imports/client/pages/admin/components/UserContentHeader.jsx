import React from "react";
import { getImagePath } from "../../../../api/utils";
import { Label } from "semantic-ui-react";
import RolesEnum, { roleGroups } from "/imports/api/users/enums/roles";

export default class UserContentHeader extends React.Component {
  constructor() {
    super();
  }

  onEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };

  render() {
    const { user } = this.props;
    const currentUserId = Meteor.userId();
    const isRep = Roles.userIsInRole(user._id, RolesEnum.REP);

    return (
      <div className="flex-content">
        <div className="intro-block text-center">
          <img
            src={
              user.avatar
                ? getImagePath(user.avatar.path)
                : "/assets/img/user1.svg"
            }
            className="lg-avatar img-circle"
            alt=""
          />
          <div className="info">
            <div className="text-light-grey">User name</div>
            <div className="text-blue email">
              {(isRep &&
                Roles.userIsInRole(
                  currentUserId,
                  roleGroups.ADMIN_TECH_MANAGER
                )) ||
              (isRep && currentUserId === user._id)
                ? user.profile && (
                    <a href={`/${user._id}/user-profile`}>
                      {user.profile.firstName + " " + user.profile.lastName}
                    </a>
                  )
                : user.profile &&
                  user.profile.firstName + " " + user.profile.lastName}
            </div>
          </div>
        </div>
        <ul className="row__info">
          <li>
            <span className="text-light-grey">First name</span>
            <span className="info-label">
              {user.profile && user.profile.firstName}
            </span>
          </li>
          <li>
            <span className="text-light-grey">Last name</span>
            <span className="info-label">
              {user.profile && user.profile.lastName}
            </span>
          </li>
          <li>
            <span className="text-light-grey">Phone</span>
            <span className="info-label">{user.profile.phoneNumber}</span>
          </li>
        </ul>
        {Roles.userIsInRole(user._id, RolesEnum.REP) && (
          <ul className="row__info">
            <li>
              <span className="text-light-grey">Tags</span>
            </li>
            {user.tags &&
              user.tags.map(tag => {
                return <li key={tag._id}>{tag.name}</li>;
              })}
          </ul>
        )}

        <button onClick={this.onEdit} className="btn-edit btn--white">
          Edit user
        </button>
      </div>
    );
  }
}
