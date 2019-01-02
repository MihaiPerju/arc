import React, { Component } from "react";
import classNames from "classnames";

export default class WorkQueueSingle extends Component {
  constructor(props) {
    super(props);
  }

  onSetWorkQueue() {
    const { workQueue, setWorkQueue } = this.props;
    setWorkQueue(workQueue._id);
  }

  onSelectWorkQueue(e) {
    e.stopPropagation();
    const { workQueue, selectWorkQueue } = this.props;
    selectWorkQueue(workQueue._id);
  }

  renderWorkQueue(moduleName) {
    return <div className="tag-item">{moduleName}</div>;
  }

  render() {
    const { workQueue, workQueuesSelected, currentWorkQueue } = this.props;
    const checked = workQueuesSelected.includes(workQueue._id);
    const classes = classNames({
      "list-item": true,
      "bg--yellow": checked,
      open: currentWorkQueue === workQueue._id
    });

    return (
      <div className={classes} onClick={this.onSetWorkQueue.bind(this)}>
        <div className="check-item">
          <input checked={checked} type="checkbox" className="hidden" />
          <label onClick={this.onSelectWorkQueue.bind(this)} />
        </div>
        <div className="row__block align-center">
          <div className="menu__icon">
            <i className="icon-tags icon-color" />
          </div>
          <div className="item-name">{workQueue.name}</div>
        </div>
      </div>
    );
  }
}
