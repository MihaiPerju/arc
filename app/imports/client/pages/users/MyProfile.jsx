import React from "react";
import { Loading } from "/imports/client/utils";
import createUserContainer from "/imports/client/lib/createUserContainer";

class MyProfile extends React.Component {
  constructor() {
    super();
  }

  render() {
    const { user } = this.props;

    if (!user) {
      return <Loading />;
    }

    return (
      <div className="cc-container settings-container">
        <div style={{ width: "100%" }} className="main-content action-content">
          <div className="main-content__wrapper">
            <div className="intro-block text-center">
              <div className="intro-block__wrapper">
                <i className="icon-user" />
                <div className="text-light-grey">User name</div>
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
