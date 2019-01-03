import React, { Component } from "react";

export default class WorkQueueContentHeader extends Component {
  onEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };

  renderWorkQueue(moduleName) {
    return <div className="tag-item-with-bg">{moduleName}</div>;
  }

  render() {
    const { workQueue } = this.props;

    return (
      <div className="main-content__header header-block">
        <div className="row__header tag-header">
          <div className="title left">{workQueue.name}</div>
          <div className="btn-group right">
            <button onClick={this.onEdit} className="btn--white">
              Edit Work Queue
            </button>
          </div>
        </div>
      </div>
    );
  }
}
