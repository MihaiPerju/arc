import React, {Component} from 'react';

export default class TimelineItem extends Component {
  render () {
    const {createdAt, icon, children} = this.props;

    return (
      <div className="timeline-item">
        <div className="timeline-caret">
          <div className="timeline-caret__outer" />
          <div className="timeline-caret__inner" />
        </div>
        <div className="timeline-item__container">
          <div className="timeline-item__icon">{icon}</div>
          <div className="timeline-item__time text-light-grey">{createdAt}</div>
          <div className="timeline-item__text">{children}</div>
        </div>
      </div>
    );
  }
}
