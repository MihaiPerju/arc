import React, { Component } from "react";
import Notifier from "/imports/client/lib/Notifier";
import moment from "moment/moment";
import SimpleSchema from "simpl-schema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import Loading from "/imports/client/lib/ui/Loading";

export default class EscalateReason extends Component {
  constructor() {
    super();
    this.state = {
      isDisabled: false
    };
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.pollingMethod = setInterval(() => {
      this.getEscalation();
    }, 3000);
  }

  getEscalation() {
    const { accountId } = this.props;
    Meteor.call("escalation.get", { accountId }, (err, escalation) => {
      if (!err) {
        this.setState({ escalation });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  componentWillUnmount() {
    //Removing Interval
    clearInterval(this.pollingMethod);
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
    const { isDisabled, escalation } = this.state;

    if (!escalation) {
      return <Loading/>
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
                {isDisabled ? (
                  <div>
                    {" "}
                    Loading
                    <i className="icon-cog" />
                  </div>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </AutoForm>
        </div>
        <div className="comment-list">
          {escalation &&
            escalation.messages.map((message, index) => {
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
