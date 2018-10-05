import React, { Component } from "react";
import Statuses from "/imports/api/letters/enums/statuses.js";
import Notifier from "/imports/client/lib/Notifier";
import TagItem from "/imports/client/lib/TagItem";
import Dialog from '../../../lib/ui/Dialog';
import classNames from 'classnames';
import { moduleNames }  from '/imports/client/pages/moduleTags/enums/moduleList'

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
    this.changeStatus(letterId);
  };

  changeStatus = letterId => {
    Meteor.call(
      "letter.updateStatus",
      letterId,
      Statuses.MANUALLY_MAILED,
      err => {
        if (!err) {
          Notifier.success("Status is changed to manually mailed");
        }
      }
    );
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

  onSubmitTags = data => {
    const { _id } = this.props.letter;
    Object.assign(data, { _id });

    Meteor.call("letter.tag", data, err => {
      if (!err) {
        Notifier.success("Tagged successfully");
      } else {
        Notifier.error(err.error);
      }
    });
  };

  render() {
    const { letter, moduleTags } = this.props;
    const { dialogIsActive } = this.state;
    const itemClasses = classNames('list-item user-item', {
      'letter-item': letter.status == Statuses.NEW
    });
    const statusClasses = classNames('status', {
      'pending': letter.status == Statuses.NEW,
      'manually': letter.status == Statuses.MANUALLY_MAILED
    });

    return (
      <div className={itemClasses}>
        <div className="row__item margin-top-10">
          {letter.isManuallyMailed ? (
            <div className="item-name text-blue">
              {letter && letter.letterTemplateName}
            </div>
          ) : (
              <div className="item-name text-dark-grey">
                {letter && letter.letterTemplateName}
              </div>
            )}
          <div className={statusClasses}>{letter.status}</div>
          {letter.status == Statuses.NEW && (
            <button
              className="btn-text--green p-0"
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
        <div className="row__item m-t--5">
          <TagItem
            title="Tag Letter"
            tagIds={letter.tagIds}
            moduleTags={moduleTags}
            onSubmitTags={this.onSubmitTags.bind(this)}
            entityName={moduleNames.LETTERS}
          />
        </div>
      </div>
    );
  }
}
