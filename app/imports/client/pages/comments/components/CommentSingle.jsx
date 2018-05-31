import React from "react";
import autoBind from "react-autobind";
import moment from "moment";

export default class CommentSingle extends React.Component {
  constructor() {
    super();

    autoBind(this);
  }

  render() {
    const { comment } = this.props;
    const { user } = comment;

    return (
      <div className="comment-item">
        <div className="comment__wrapper">
          <div className="name">
            {user && `${user.profile.firstName} ${user.profile.lastName}`}
          </div>
          <div className="message text-light-grey">{comment.content}</div>
        </div>
        <div className="time">
          {comment && moment(comment.createdAt).format("MMMM Do YYYY, hh:mm a")}
        </div>
      </div>
    );
  }
}
