import React, { Component } from "react";
import classNames from "classnames";
import pages from "/imports/api/settings/enums/settings";
import SettingsContent from "./SettingsContent";
import RolesEnum from "/imports/api/users/enums/roles";

export default class ManagerSettings extends Component {
  constructor() {
    super();
    this.state = {
      pageSelected: null
    };
  }

  onSelectPage = pageSelected => {
    if (pageSelected === this.state.pageSelected) {
      this.setState({ pageSelected: null });
    } else {
      this.setState({ pageSelected });
    }
  };

  onCloseRightSide = () => {
    this.setState({ pageSelected: null });
  };

  getClassNames(pageSelected) {
    return classNames({
      "list-item": true,
      open: pageSelected === this.state.pageSelected
    });
  }

  renderManagerSettings() {
    return (
      <div className="task-list templates flex_screen">
        {
          (Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) &&
          <div
            className={this.getClassNames(pages.THRESHOLDS)}
            onClick={this.onSelectPage.bind(this, pages.THRESHOLDS)}>
            <div className="row__item">
              <div className="item-name setting_label" >Thresholds</div>  
            </div>
          </div>
        }
        <div
          className={this.getClassNames(pages.WIDGET_SETTINGS)}
          onClick={this.onSelectPage.bind(this, pages.WIDGET_SETTINGS)}>
          <div className="row__item">
            <div className="item-name setting_label" >Widget Settings</div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { pageSelected } = this.state;
    return (
      <div className="cc-container">
        <div className={pageSelected ? "left__side" : "left__side full__width"}>
          {this.renderManagerSettings()}
        </div>
        {pageSelected && (
          <SettingsContent
            onClose={this.onCloseRightSide}
            page={pageSelected}
          />
        )}
      </div>
    );
  }
}
