import React, { Component } from "react";
import Loading from "/imports/client/lib/ui/Loading";
import autoBind from "react-autobind";
import Notifier from "/imports/client/lib/Notifier";
import {
  AutoForm,
  AutoField,
  ErrorField
} from "uniforms-semantic";
import SimpleSchema from "simpl-schema";
import CommentSingle from "./CommentSingle.jsx";

export default class CommentList extends Component {
  constructor() {
    super();

    this.state = {
      content: null
    };

    autoBind(this);
  }

  onSubmit({ content }) {
    const { accountId } = this.props;
    if (!content) {
      Notifier.error("Message has no content");
    } else {
      Meteor.call("comment.create", content, accountId, err => {
        if (!err) {
          Notifier.success("Comment added!");
          this.refs.comment.reset();
        } else {
          Notifier.error(err.reason);
        }
      });
    }
  }

  render() {
    const { data, loading, error } = this.props;
    const path = Meteor.user().avatar && "/assets/img/user.svg";

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error.reason}</div>;
    }

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
        </div>
        <div className="comment-list">
          {data &&
            data.map((comment, index) => {
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
