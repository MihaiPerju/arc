import React, { Component } from "react";
import classNames from "classnames";
import Statuses from "/imports/api/letters/enums/statuses.js";
import Dialog from "/imports/client/lib/ui/Dialog";
import Notifier from "/imports/client/lib/Notifier";

export default class LetterSingle extends Component {
  constructor() {
    super();
    this.state = {
      dialogIsActive: false
    };
  }

  setMailManually = letterId => {
    Meteor.call("letter.mailManually", letterId, err => {
      if (!err) {
        Notifier.success("Letter is manually mailed");
      }
    });
    this.changeStatus(letterId)
  };

  changeStatus = (letterId) => {
    Meteor.call("letter.updateStatus", letterId, Statuses.MANUALLY_MAILED, err => {
      if (!err) {
        Notifier.success("Status is changed to manually mailed");
      }
    });
  };

  markedManual = () => {
    this.setState({
      dialogIsActive: true
    });
  };

  confirmMarked = letterId => {
    this.setState({
      dialogIsActive: false
    });
    this.setMailManually(letterId);
  };

  closeDialog = () => {
    this.setState({
      dialogIsActive: false
    });
  };

  render() {
    const classes = classNames({
      "list-item": true,
      "user-item": true
    });
    const { letter } = this.props;
    const { dialogIsActive } = this.state;
    return (
      <div className={classes}>
        <div className="row__block align-center">
          {letter.isManuallyMailed ? (
            <div className="item-name text-blue">
              {letter.letterTemplate.name && letter.letterTemplate.name}
            </div>
          ) : (
            <div className="item-name text-dark-grey">
              {letter.letterTemplate.name && letter.letterTemplate.name}
            </div>
          )}
          <div className="status pending">{letter.status}</div>
          {letter.status == Statuses.NEW && (
            <button
              className="btn-text--green"
              onClick={this.markedManual.bind(this)}
            >
              Manual Mailing
            </button>
          )}
          {dialogIsActive && (
            <Dialog
              title="Confirm"
              className="account-dialog"
              closePortal={this.closeDialog}
            >
              <div className="form-wrapper">
                Marking a letter manually mailed means it will not be tracked /
                updated by the auto mailing system, are sure you want to mark
                this letter as manually mailed?
              </div>
              <div className="btn-group">
                <button className="btn-cancel" onClick={this.closeDialog}>
                  Cancel
                </button>
                <button
                  className="btn--light-blue"
                  onClick={this.confirmMarked.bind(this, letter._id)}
                >
                  Confirm & Marked
                </button>
              </div>
            </Dialog>
          )}
        </div>
      </div>
    );
  }
}
