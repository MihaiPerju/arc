import React, { Component } from "react";
import ActionHeader from "./components/ActionContentHeader";
import ActionEdit from "./ActionEdit";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class ActionContent extends Component {
  constructor() {
    super();
    this.state = {
      edit: false
    };
    this.pollingMethod = null;
  }

  componentWillMount() {
    const { id } = FlowRouter.current().params;
    if (id) {
      this.setEdit();
    }
    this.pollingMethod = setInterval(() => {
      this.getAction();
    }, 3000);
  }

  getAction() {
    const { currentAction } = this.props;
    Meteor.call("action.getOne", currentAction, (err, action) => {
      if (!err) {
        this.setState({ action });
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

  render() {
    const { substates } = this.props;
    const { action, edit } = this.state;

    if (!action) {
      return <Loading />;
    }

    return (
      <div className="section-action">
        {edit ? (
          <ActionEdit
            setEdit={this.setEdit}
            substates={substates}
            action={action}
          />
        ) : (
          <ActionHeader
            setEdit={this.setEdit}
            substates={substates}
            action={action}
          />
        )}
      </div>
    );
  }
}
