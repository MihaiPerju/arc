import React, { Component } from "react";
import WorkQueueSingle from "./WorkQueueSingle";

export default class WorkQueueList extends Component {
  render() {
    const { workQueues } = this.props;
    const workQueueList = workQueues.map(function(workQueue) {
      const {
        setWorkQueue,
        selectWorkQueue,
        workQueuesSelected,
        currentWorkQueue
      } = this.props;
      return (
        <WorkQueueSingle
          workQueuesSelected={workQueuesSelected}
          currentWorkQueue={currentWorkQueue}
          selectWorkQueue={selectWorkQueue}
          setWorkQueue={setWorkQueue}
          workQueue={workQueue}
          key={workQueue._id}
        />
      );
    }, this);
    return <div className={this.props.class}>{workQueueList}</div>;
  }
}
