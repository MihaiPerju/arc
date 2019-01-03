import React, { Component } from "react";
import WorkQueueContentHeader from "./WorkQueueContentHeader";
import WorkQueueEdit from "../WorkQueueEdit";
import WorkQueueDescription from "./WorkQueueDescription";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class WorkQueueContent extends Component {
  constructor() {
    super();
    this.state = {
      edit: false,
      users: []
    };
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.getData();
    this.pollingMethod = setInterval(() => {
      this.getData();
    }, 3000);
  }

  getData() {
    const { currentWorkQueue } = this.props;
    Meteor.call("workQueue.getOne", currentWorkQueue, (err, workQueue) => {
      if (!err) {
        this.setState({ workQueue });
      } else {
        Notifier.error(err.reason);
      }
    });
    const clientId = FlowRouter.current().params.clientId;
    Meteor.call("reps.getForWorkQueue", clientId, (err, users) => {
      if (!err) {
        this.setState({ users });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  componentWillUnmount = () => {
    //Removing Interval
    clearInterval(this.pollingMethod);
  };

  setEdit = () => {
    const { edit } = this.state;
    this.setState({ edit: !edit });
  };

  sortUsers = () => {
    const oldUsers = [],
      newUsers = [];
    const { workQueue, users } = this.state;
    _.map(users, user => {
      const index = user.workQueueIds
        ? user.workQueueIds.indexOf(workQueue && workQueue._id)
        : -1;
      if (index > -1) {
        oldUsers.push(user);
      } else {
        newUsers.push(user);
      }
    });
    return { oldUsers, newUsers };
  };

  render() {
    const { workQueue, edit, users } = this.state;

    const { oldUsers, newUsers } = this.sortUsers();
    if (!workQueue) {
      return <Loading />;
    }
    return (
      <div className="main-content tag-content">
        {edit ? (
          <WorkQueueEdit setEdit={this.setEdit} workQueue={workQueue} />
        ) : (
          <div>
            <WorkQueueContentHeader
              setEdit={this.setEdit}
              workQueue={workQueue}
            />
            <WorkQueueDescription
              oldUsers={oldUsers}
              newUsers={newUsers}
              users={users}
              currentWorkQueue={workQueue}
            />
          </div>
        )}
      </div>
    );
  }
}
