import React, { Component } from "react";
import ActionHeader from "./components/ActionContentHeader";
import ActionEdit from "./ActionEdit";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class ActionContent extends Component {
  constructor() {
    super();
    this.state = {
      action: null,
      edit: false
    };
    this.pollingMethod = null;
  }

  componentWillMount() {
    const { id } = FlowRouter.current().params;
    if (id) {
      this.setEdit();
    }

    this.getAction(this.props.currentAction)
  }


  componentWillReceiveProps(nextProps) {
    if(nextProps.currentAction === this.props.currentAction)
      return;

    this.getAction(nextProps.currentAction);
  }

  getAction(currentAction) {
    Meteor.call("action.getOne", currentAction, (err, action) => {
      if (!err) {
        this.setState({ action });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  setEdit = () => {
    const { edit } = this.state;
    this.setState({ edit: !edit });
  };

  render() {
    if (!this.state.action) {
      return <Loading />;
    }

    return (
      <div className="section-action">
        {this.state.edit ? (
          <ActionEdit
            setEdit={this.setEdit}
            substates={this.props.substates}
            action={this.state.action}
          />
        ) : (
          <ActionHeader
            setEdit={this.setEdit}
            substates={this.props.substates}
            action={this.state.action}
          />
        )}
      </div>
    );
  }
}
