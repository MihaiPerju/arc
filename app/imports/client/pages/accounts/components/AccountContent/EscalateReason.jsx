import React, { Component } from "react";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import escalationQuery from "/imports/api/escalations/queries/escalationList";
import Notifier from "/imports/client/lib/Notifier";
import Dialog from "/imports/client/lib/ui/Dialog";
import classNames from "classnames";
import SimpleSchema from "simpl-schema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";

export default class EscalateReason extends Component {
  constructor() {
    super();
    this.state = {
      escalation: {},
      dialogIsActive: false
    };
  }

  componentWillMount() {
    const { escalationId } = this.props;
    Meteor.call("escalation.get", escalationId, (err, escalation) => {
      if (!err) {
        this.setState({ escalation });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  onOpenDialog = () => {
    this.setState({
      dialogIsActive: true
    });
  };

  onCloseDialog = () => {
    this.setState({
      dialogIsActive: false
    });
  };

  onRespond = content => {
    const { escalationId } = this.props;
    Meteor.call("escalation.addMessage", content, escalationId, err => {
      if (!err) {
        Notifier.success("Response sent!");
        FlowRouter.setParams({ state: "escalated" });
      } else {
        Notifier.error(err.reason);
      }
    });
    this.onCloseDialog();
  };

  render() {
    const dialogClasses = classNames("account-dialog");
    const { escalation, accountId, dialogIsActive } = this.state;
    return (
      <div className="action-block">
        <div className="header__block">
          <div className="title-block text-uppercase">escalate reason</div>
        </div>
        {escalation.messages &&
          escalation.messages.map(message => {
            return (
              <div className="main__block">
                <div className="description-block">
                  <p className="text-light-grey">{message.content}</p>
                </div>
              </div>
            );
          })}

        <div
          style={{ border: "1px #e1e1e1 solid" }}
          onClick={this.onOpenDialog}
          className="main__block"
        >
          <div className="description-block">
            <p className="text-light-grey">Respond</p>
          </div>
        </div>
        {dialogIsActive && (
          <Dialog
            className={dialogClasses}
            closePortal={this.onCloseDialog}
            title="Respond to escalation"
          >
            <AutoForm onSubmit={this.onRespond} schema={escalateSchema}>
              <div className="form-wrapper">
                <AutoField
                  labelHidden={true}
                  placeholder="Type a message"
                  name="content"
                />
                <ErrorField name="content" />
              </div>
              <div className="btn-group">
                <button className="btn-cancel" onClick={this.onCloseDialog}>
                  Cancel
                </button>
                <button type="submit" className="btn--light-blue">
                  Confirm & send
                </button>
              </div>
            </AutoForm>
          </Dialog>
        )}
      </div>
    );
  }
}

const escalateSchema = new SimpleSchema({
  content: {
    type: String
  }
});
