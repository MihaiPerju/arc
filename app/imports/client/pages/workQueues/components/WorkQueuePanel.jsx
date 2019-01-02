import React, { Component } from "react";
import WorkQueueCreate from "../WorkQueueCreate";
import WorkQueueContent from "./WorkQueueContent";

export default class WorkQueuePanel extends Component {
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
    const { currentWorkQueue, create, close } = this.props;
    if (create) {
      return (
        <div className={fade ? "right__side in" : "right__side"}>
          <WorkQueueCreate close={close} />
        </div>
      );
    }
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        <WorkQueueContent currentWorkQueue={currentWorkQueue} />
      </div>
    );
  }
}
