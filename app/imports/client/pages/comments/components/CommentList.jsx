import React, { Component } from "react";
import autoBind from "react-autobind";
import CommentSingle from "./CommentSingle.jsx";
import Notifier from "/imports/client/lib/Notifier";
import {
  AutoForm,
  AutoField,
  ErrorField,
  SelectField
} from "uniforms-semantic";
import SimpleSchema from "simpl-schema";
import { getImagePath } from "../../../../api/utils";

export default class CommentList extends Component {
  constructor() {
    super();

    this.state = {
      content: null
    };

    autoBind(this);
  }

  onSubmit({ content }) {
    const { account } = this.props;
    if (!content) {
      Notifier.error("Message has no content");
    } else {
      Meteor.call(
        "account.comment.add",
        { content, accountId: account._id },
        err => {
          if (!err) {
            Notifier.success("Comment added!");
            this.refs.comment.reset();
          } else {
            Notifier.error(err.reason);
          }
        }
      );
    }
  }

  render() {
    const { account, comments } = this.props;
    const path = Meteor.user().avatar && "/assets/img/user.svg";
    return (
      <div className="action-block">
        <div className="header__block">
          <div className="title-block text-uppercase">Comments</div>
        </div>
        <div className="comment-block">
          <AutoForm ref="comment" schema={schema} onSubmit={this.onSubmit}>
            <div className="form-group">
              <img
                className="md-avatar img-circle"
                src={path ? getImagePath(path) : "/assets/img/user.svg"}
                alt=""
              />
              <AutoField
                className="text-area"
                style={{ width: "80%" }}
                placeholder="Leave your comment"
                name="content"
              />
              <ErrorField name="content" />
              <button className="btn-post">Post</button>
            </div>
          </AutoForm>
        </div>
        <div className="comment-list">
          {comments
            .map((comment, index) => {
              return <CommentSingle comment={comment} key={index} />;
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
