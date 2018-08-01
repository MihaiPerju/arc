import React, {Component} from 'react';

export default class ActionDropdown extends Component {
  constructor() {
    super();
    this.state = {
      isOpenedDropdown: false
    }
  }

  openDropdown = () => {
    const {isOpenedDropdown} = this.state;

    if (!isOpenedDropdown) {
      document.addEventListener("click", this.outsideClick, false);
    } else {
      document.removeEventListener("click", this.outsideClick, false);
    }

    this.setState({
      isOpenedDropdown: !isOpenedDropdown
    })
  };

  outsideClick = e => {
    if (this.node && this.node.contains(e.target)) {
      return;
    }

    this.openDropdown();
  };

  nodeRef = node => {
    this.node = node;
  };

  render() {
    const {isOpenedDropdown} = this.state;
    const {status, facilityHref, regionHref, onEdit, disableAction, onOpenAssignDialog} = this.props;

    return (
      <div className="action-dropdown" ref={this.nodeRef}>
        <div className="action-dropdown__btn" onClick={this.openDropdown}>
          <i className="icon-angle-down"/>
        </div>
        {
          isOpenedDropdown && (
            <div className="action-dropdown__container">
              <div className="action-caret">
                <div className="action-caret__outer"/>
                <div className="action-caret__inner"/>
              </div>
              <ul className="action-list">
                <li className="action-item">
                  <a href={regionHref}>Manage regions</a>
                </li>
                <li className="action-item">
                  <a href={facilityHref}>Manage facilities</a>
                </li>
                <li className="action-item">
                  <a href="" onClick={onEdit}>Edit client</a>
                </li>
                <li className="action-item">
                  <a href="" onClick={disableAction}>{status ? "Disable client" : "Enable client"}</a>
                </li>
                <li className="action-item">
                  <a href="" onClick={onOpenAssignDialog}>Assign Manager</a>
                </li>
              </ul>
            </div>
          )
        }
      </div>
    )
  }
}