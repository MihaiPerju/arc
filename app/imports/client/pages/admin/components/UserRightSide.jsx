import React, { Component } from "react";
import UserContent from "../UserContent.jsx";
import CreateUser from "../CreateUser.jsx";

export default class RightSide extends Component {
  constructor() {
    super();
    this.state = {
      fade: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ fade: true });
    }, 300);
  }

  render() {
    const { currentUser, create, close } = this.props;

    const { fade } = this.state;
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {create ? (
          <CreateUser close={close} />
        ) : (
          <UserContent currentUser={currentUser} />
        )}
      </div>
    );
  }
}
