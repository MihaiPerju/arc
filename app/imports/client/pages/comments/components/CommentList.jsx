import React, { Component } from "react";
import autoBind from "react-autobind";
import Notifier from "/imports/client/lib/Notifier";
import { AutoForm, AutoField, ErrorField } from "uniforms-unstyled";
import SimpleSchema from "simpl-schema";
import CommentSingle from "./CommentSingle.jsx";
import RolesEnum from "/imports/api/users/enums/roles";

export default class CommentList extends Component {
  constructor() {
    super();

    this.state = {
      content: null,
      isCorrectNote: false
    };

    autoBind(this);
  }

  onSubmit({ content }) {
    const { account } = this.props;
    let { isCorrectNote } = this.state;
    isCorrectNote =
      Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER) && isCorrectNote
        ? true
        : undefined;

    if (!content) {
      Notifier.error("Message has no content");
    } else {
      Meteor.call(
        "account.comment.add",
        { content, accountId: account._id, isCorrectNote },
        err => {
          if (!err) {
            Notifier.success("Comment added!");
            this.refs.comment.reset();
            this.setState({ isCorrectNote: false });
          } else {
            Notifier.error(err.reason);
          }
        }
      );
    }
  }

  onSwitchNoteState = () => {
    const { isCorrectNote } = this.state;
    this.setState({ isCorrectNote: !isCorrectNote });
  };

  render() {
    const { account, comments, closeRightPanel } = this.props;
    const { isCorrectNote } = this.state;

    return (
      <div className="action-block">
        <div className="header__block">
          <div className="title-block text-uppercase">Comments</div>
        </div>
        <div className="comment-block">
          <AutoForm ref="comment" schema={schema} onSubmit={this.onSubmit}>
            <div className="form-group">
              <AutoField
                className="text-area"
                placeholder="Leave your comment"
                name="content"
              />
              <ErrorField name="content" />
              <button className="btn-post">Post</button>
            </div>
          </AutoForm>
          {Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER) && (
            <div className="check-group">
              <input checked={isCorrectNote} type="checkbox" />
              <label onClick={this.onSwitchNoteState}>Correct note</label>
            </div>
          )}
        </div>
        <div className="comment-list">
          {comments.map((comment, index) => {
            return (
              <CommentSingle
                account={account}
                comment={comment}
                key={index}
                commentId={index}
                closeRightPanel={closeRightPanel}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

const schema = new SimpleSchema({
  content: {
    type: String,
    optional: true,
    label: false
  }
});
