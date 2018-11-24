import React, { Component } from "react";
import classNames from "classnames";
import pages from "./enums/pages";
import ActionContent from './components/ActionContent';

export default class BulkAction extends Component {
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
          <div
            className={this.getClassNames(pages.ASSIGN_USER)}
            onClick={this.onSelectPage.bind(this, pages.ASSIGN_USER)}
          >
            <div className="row__item margin-top-10">
              <div className="item-name">Assign By User</div>
            </div>
          </div>

          <div
            className={this.getClassNames(pages.ASSIGN_WORKQUEUE)}
            onClick={this.onSelectPage.bind(this, pages.ASSIGN_WORKQUEUE)}
          >
            <div className="row__item margin-top-10">
              <div className="item-name">Assign By Work Queue</div>
            </div>
          </div>

          <div
            className={this.getClassNames(pages.ASSIGN_ACTION)}
            onClick={this.onSelectPage.bind(this, pages.ASSIGN_ACTION)}
          >
            <div className="row__item margin-top-10">
              <div className="item-name">Assign Action</div>
            </div>
          </div>
        </div>
        {pageSelected && (
           <ActionContent
           onClose={this.onCloseRightSide}
           page={pageSelected}
         />
        )}
      </div>
    );
  }
}
