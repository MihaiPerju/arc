import React, { Component } from "react";
import classNames from "classnames";
import pages from "/imports/api/settings/enums/settings";
import SettingsContent from "./components/SettingsContent";
import RolesEnum from "../../../../api/users/enums/roles";

export default class SettingsListContainer extends Component {
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

  render() {
    const { pageSelected } = this.state;
    return (

      <div className="cc-container">
        <div className={pageSelected ? "left__side" : "left__side full__width"}>
          <div className="task-list templates">
            <div>
              <div
                className={this.getClassNames(pages.ROOT)}
                onClick={this.onSelectPage.bind(this, pages.ROOT)}
              >
                <div className="row__item margin-top-10">
                  <div className="item-name">Root Directory</div>
                </div>
              </div>

              <div
                className={this.getClassNames(pages.LETTERS_DIRECTORY)}
                onClick={this.onSelectPage.bind(this, pages.LETTERS_DIRECTORY)}
              >
                <div className="row__item margin-top-10">
                  <div className="item-name">Letter Directory</div>
                </div>
              </div>

              <div
                className={this.getClassNames(pages.SMTP)}
                onClick={this.onSelectPage.bind(this, pages.SMTP)}
              >
                <div className="row__item margin-top-10">
                  <div className="item-name">SMTP Settings</div>
                </div>
              </div>

              <div
                className={this.getClassNames(pages.COMPILE_TIME)}
                onClick={this.onSelectPage.bind(this, pages.COMPILE_TIME)}
              >
                <div className="row__item margin-top-10">
                  <div className="item-name">Letter Compilation Time</div>
                </div>
              </div>
            </div>
          </div>

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
