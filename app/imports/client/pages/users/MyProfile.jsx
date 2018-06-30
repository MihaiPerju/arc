import React from "react";
import { Meteor } from "meteor/meteor";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import MyProfileSchema from "/imports/api/users/schemas/MyProfileSchema";
import { Notifier, Loading } from "/imports/client/utils";
import createUserContainer from "/imports/client/lib/createUserContainer";
import MyAvatar from "./components/MyAvatar";

class MyProfile extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { user } = this.props;
    const { error } = this.state;

    if (!user) {
      return <Loading />;
    }

    const model = {
      profile: user.profile,
      email: user.getEmail()
    };

    return (
      <div className="cc-container settings-container">
        <div style={{ width: "100%" }} className="main-content action-content">
          <div className="main-content__wrapper">
            <div className="intro-block text-center">
              <div className="intro-block__wrapper">
                <i className="icon-user" />
                <div className="text-light-grey">User name</div>
                {/* <MyAvatar user={user}/> */}
                <div className="action-name">
                  {user.profile
                    ? user.profile.firstName + " " + user.profile.lastName
                    : "No username"}
                </div>
              </div>
            </div>
            <div
              style={{ display: "table", margin: "0 auto" }}
              className="info-block"
            >
              <div className="text-block">
                <div className="text-light-grey text-label">Email</div>
                <div className="status">{user.getEmail()}</div>
              </div>
              <div className="text-block">
                <div className="text-light-grey text-label">Phone number</div>
                <p>
                  {user.profile ? user.profile.phoneNumber : "No Phone Number"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default createUserContainer(MyProfile);
