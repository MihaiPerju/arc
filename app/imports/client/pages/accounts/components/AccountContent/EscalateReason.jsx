import React, { Component } from "react";
import Notifier from "/imports/client/lib/Notifier";
import Dialog from "/imports/client/lib/ui/Dialog";
import classNames from "classnames";
import SimpleSchema from "simpl-schema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/escalations/queries/escalationList";

class EscalateReason extends Component {
  constructor() {
    super();
    this.state = {
      escalation: {},
      dialogIsActive: false
    };
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
    const { closeRightPanel, accountId } = this.props;
    Meteor.call("escalation.addMessage", content, accountId, err => {
      if (!err) {
        Notifier.success("Response sent!");
        closeRightPanel();
      } else {
        Notifier.error(err.reason);
      }
    });
    this.onCloseDialog();
  };

  render() {
    const dialogClasses = classNames("account-dialog");
    const { dialogIsActive } = this.state;
    const { data, isLoading, error } = this.props;

    if (isLoading) {
      return <div>Loading</div>;
    }

    if (error) {
      return <div>{error.reason}</div>;
    }
    return (
      <div className="action-block">
        <div className="header__block">
          <div className="title-block text-uppercase">escalate reason</div>
        </div>
        {data.messages &&
          data.messages.map(message => {
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

export default withQuery(
  props => {
    return query.clone();
  },
  { reactive: true, single: true }
)(EscalateReason);
