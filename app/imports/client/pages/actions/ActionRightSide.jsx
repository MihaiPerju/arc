import React, { Component } from "react";
import ActionContent from "./ActionContent.jsx";
import ActionCreate from "./ActionCreate.jsx";

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
    const { fade } = this.state;
    const { currentAction, create, close, substates } = this.props;
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {create ? (
          <ActionCreate substates={substates} close={close} />
        ) : (
          <ActionContent substates={substates} currentAction={currentAction} />
        )}
      </div>
    );
  }
}
