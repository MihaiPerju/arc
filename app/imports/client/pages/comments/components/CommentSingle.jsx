import React from "react";
import autoBind from "react-autobind";
import moment from "moment";

export default class CommentSingle extends React.Component {
  constructor() {
    super();

    autoBind(this);
  }

  render() {
    const { comment, commentId } = this.props;
    const { user } = comment;

    return (
      <div className="comment-item flex--helper flex--column">
        <div className="comment__wrapper flex--helper flex-justify--space-between">
          <div className="name truncate">
            {user && (
              <a href={`/${user._id}/user-profile`}>
                {user.profile.firstName + "" + user.profile.lastName}
              </a>
            )}
          </div>
          <div className="time">
            {comment &&
              moment(comment.createdAt).format("MMMM Do YYYY, hh:mm a")}
          </div>
          <div className="flag-item">
            <input type="checkbox" id={commentId} className="hidden" />
            <label htmlFor={commentId} />
          </div>
        </div>
        <div className="message text-light-grey">{comment.content}</div>
      </div>
    );
  }
}
