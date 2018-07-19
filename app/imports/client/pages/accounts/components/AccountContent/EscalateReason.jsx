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
      escalation: {}
    };
  }

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
  };

  render() {
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
        <div className="comment-block">
          <AutoForm onSubmit={this.onRespond} schema={escalateSchema}>
            <div className="form-group">
              <AutoField
                className="text-area"
                labelHidden={true}
                placeholder="Type escalate reason..."
                name="content"
              />
              <ErrorField name="content" />
              <button type="submit" className="btn-post">
                Post
              </button>
            </div>
          </AutoForm>
        </div>
        <div className="comment-list">
          {data.messages &&
            data.messages.map(message => {
              return (
                <div className="comment-item flex--helper flex--column">
                  <div className="comment__wrapper flex--helper flex-justify--space-between">
                    {/*Add name from db*/}
                    <div className="name truncate">Katlyn Greenholt</div>
                    {/*Add time from db*/}
                    <div className="time">July 12th 2018, 02:08 pm</div>
                  </div>
                  <div className="message text-light-grey">
                    {message.content}
                  </div>
                </div>
              );
            })}
        </div>
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
