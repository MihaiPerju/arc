import React, { Component } from "react";

export default class WorkQueueContentSingle extends Component {
  removeWorkQueue = _id => {
    const { removeWorkQueues } = this.props;
    removeWorkQueues([_id]);
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
    const { userName, userId } = this.props;

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
            onClick={() => this.removeWorkQueue(userId)}
            className="btn-text--grey"
          >
            <i className="icon-trash-o" />
          </button>
        </div>
      </div>
    );
  }
}
