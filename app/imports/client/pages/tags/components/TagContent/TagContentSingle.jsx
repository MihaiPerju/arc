import React, { Component } from "react";
import Notifier from "/imports/client/lib/Notifier";

export default class TagContentSingle extends Component {
  removeTag = _id => {
    const { removeTags } = this.props;
    removeTags([_id]);
  };

  isSelected = () => {
    const { selectedUser, userId } = this.props;
    return selectedUser.indexOf(userId) > -1;
  };

  onClick = userId => {
    const { toggleUser } = this.props;
    toggleUser(userId);
  };

  render() {
    const { userName, userId, selectedUser } = this.props;

    return (
      <div className="action-table__row flex--helper">
        <div className="action-table__field truncate">
          <div className="check-item">
            <input
              onClick={() => this.onClick(userId)}
              checked={this.isSelected()}
              id={userId}
              type="checkbox"
              className="hidden"
            />
            <label htmlFor={userId} />
          </div>
          {userName}
        </div>
        <div className="action-table__field text-center">
          <button
            onClick={() => this.removeTag(userId)}
            className="btn-text--grey"
          >
            <i className="icon-trash-o" />
          </button>
        </div>
      </div>
    );
  }
}
