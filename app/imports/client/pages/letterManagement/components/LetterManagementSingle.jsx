import React, { Component } from "react";
import { getImagePath } from "/imports/api/utils";
import classNames from "classnames";
import Statuses from "/imports/api/letters/enums/statuses.js";

export default class LetterManagementSingle extends Component {
  render() {
    const classes = classNames({
      "list-item": true,
      "user-item": true
    });
    const { letter, letterName } = this.props;
    return (
      <div className={classes}>
        <div className="row__block align-center">
          <div className="item-name text-blue">{letterName}</div>
          <div className="status pending">{letter.status}</div>
          <button
              className="btn-text--green"
            >
              Manual Mailing
            </button>
        </div>
      </div>
    );
  }
}
