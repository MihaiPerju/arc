import React, { Component } from "react";
import Notifier from "/imports/client/lib/Notifier";
import moment from "moment/moment";
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
      isDisabled: false
    };
  }

  onRespond = content => {
    const { closeRightPanel, accountId } = this.props;
    this.setState({ isDisabled: true });
    Meteor.call("escalation.addMessage", content, accountId, err => {
      if (!err) {
        Notifier.success("Response sent!");
        closeRightPanel();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  };

  render() {
    const { data, isLoading, error } = this.props;
    const { isDisabled } = this.state;

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
              <button
                style={isDisabled ? { cursor: "not-allowed" } : {}}
                disabled={isDisabled}
                type="submit"
                className="btn-post"
              >
               {isDisabled?<div> Loading<i className="icon-cog"/></div>:"Post"}
              </button>
            </div>
          </AutoForm>
        </div>
        <div className="comment-list">
          {data &&
            data.messages.map((message, index) => {
              return (
                <div
                  key={index}
                  className="comment-item flex--helper flex--column"
                >
                  <div className="comment__wrapper flex--helper flex-justify--space-between">
                    {/*Add name from db*/}
                    <div className="name truncate">{message.userName}</div>
                    {/*Add time from db*/}
                    <div className="time">
                      {moment(message.createdAt).format(
                        "MMMM Do YYYY, hh:mm a"
                      )}
                    </div>
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
    const { accountId } = props;
    return query.clone({ filters: { accountId } });
  },
  { reactive: true, single: true }
)(EscalateReason);
