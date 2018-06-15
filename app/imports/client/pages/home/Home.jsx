import React from "react";
import RoleEnum from "../../../api/users/enums/roles";
import { createContainer } from "meteor/react-meteor-data";
import Notifications from "./components/Notifications";

export default class Home extends React.Component {
  render() {
    return (
      <div className="cc-container home-container flex-align--start">
        <Notifications />
      </div>
    );
  }
}
