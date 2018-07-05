import React from "react";
import autoBind from "react-autobind";
import moment from "moment";
import Dialog from "/imports/client/lib/ui/Dialog";
import classNames from "classnames";
import Loading from "/imports/client/lib/ui/Loading";
import SimpleSchema from "simpl-schema";
import { AutoForm, ErrorField, LongTextField } from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";
import RolesEnum, { roleGroups } from "/imports/api/users/enums/roles";

export default class CommentSingle extends React.Component {
  constructor() {
    super();
    this.state = {
      dialogIsActive: false,
      selectedCommentId: null,
      selectedFlag: {},
      isFlagApproved: false
    };
    autoBind(this);
  }

  isFlagChecked = commentId => {
    const { flags } = this.props.account;
    const index = flags.findIndex(flag => {
      const { flagAction } = flag;
      return flagAction.commentId === commentId && flagAction.isOpen;
    });
    return index > -1 ? true : false;
  };

  isDisabledForReps = commentId => {
    const { flags } = this.props.account;
    const userId = Meteor.userId();
    if (Roles.userIsInRole(userId, RolesEnum.REP)) {
      const index = flags.findIndex(flag => {
        const { flagAction } = flag;
        return flagAction.commentId === commentId && flagAction.isOpen;
      });
      return index > -1 ? true : false;
    } else if (Roles.userIsInRole(userId, RolesEnum.MANAGER)) {
      const index = flags.findIndex(flag => {
        const { flagAction } = flag;
        return flagAction.commentId === commentId && flagAction.isOpen;
      });
      return index === -1 ? true : false;
    }
  };

  onOpenDialog = id => {
    const { flags } = this.props.account;
    let selectedFlag = {};
    if (Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) {
      selectedFlag =
        flags.filter(flag => flag.flagAction.commentId === id)[0].flagAction ||
        {};
    }
    this.setState({
      dialogIsActive: true,
      selectedCommentId: id,
      selectedFlag,
      isFlagApproved: false
    });
  };

  onCloseDialog = () => {
    this.setState({
      dialogIsActive: false,
      selectedCommentId: null,
      selectedFlag: {}
    });
  };

  onFlagAdd = data => {
    const { account } = this.props;
    const { selectedCommentId } = this.state;
    const { _id, facilityId } = account;

    Object.assign(data, {
      commentId: selectedCommentId,
      accountId: _id,
      facilityId
    });

    Meteor.call("comment.createFlag", data, err => {
      if (!err) {
        Notifier.success("Flagged successfully");
      } else {
        Notifier.error(err.error);
      }
      this.onCloseDialog();
    });
  };

  onFlagRepond = data => {
    const { selectedFlag, isFlagApproved } = this.state;
    const { flagResponse } = data;

    Meteor.call(
      "comment.respondFlag",
      { _id: selectedFlag._id, flagResponse, isFlagApproved },
      err => {
        if (!err) {
          Notifier.success("Responded");
        } else {
          Notifier.error(err.error);
        }
        this.onCloseDialog();
      }
    );
  };

  handleFlagApproval = () => {
    const { isFlagApproved } = this.state;
    this.setState({ isFlagApproved: !isFlagApproved });
  };

  render() {
    const { data, comment, commentId, isLoading, error } = this.props;
    const { dialogIsActive, selectedFlag, isFlagApproved } = this.state;
    const { user } = comment;
    const dialogClasses = classNames("account-dialog");
    const userId = Meteor.userId();
    
    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error.reason}</div>;
    }

    return (
      <div className="comment-item flex--helper flex--column">
        <div className="comment__wrapper flex--helper flex-justify--space-between">
          <div className="name truncate">
            {user && `${user.profile.firstName} ${user.profile.lastName}`}
          </div>
          <div className="time">
            {comment &&
              moment(comment.createdAt).format("MMMM Do YYYY, hh:mm a")}
          </div>
          {Roles.userIsInRole(Meteor.userId(), roleGroups.MANAGER_REP) && (
            <div className="flag-item">
              <input
                checked={this.isFlagChecked(comment._id)}
                disabled={this.isDisabledForReps(comment._id)}
                onChange={() => this.onOpenDialog(comment._id)}
                type="checkbox"
                id={`flag-comment-${commentId}`}
                className="hidden"
              />
              <label htmlFor={`flag-comment-${commentId}`} />
            </div>
          )}
        </div>
        <div className="message text-light-grey">{comment.content}</div>
        {dialogIsActive && (
          <Dialog
            className={dialogClasses}
            closePortal={this.onCloseDialog}
            title="Flag comment"
          >
            {Roles.userIsInRole(userId, RolesEnum.REP) && (
              <AutoForm onSubmit={this.onFlagAdd} schema={flagSchema}>
                <div className="form-wrapper">
                  <LongTextField
                    labelHidden={true}
                    placeholder="Type flag reason"
                    name="flagReason"
                  />
                  <ErrorField name="flagReason" />
                </div>
                <div className="btn-group">
                  <button className="btn-cancel" onClick={this.onCloseDialog}>
                    Cancel
                  </button>
                  <button type="submit" className="btn--light-blue">
                    Confirm & send
                  </button>
                </div>
              </AutoForm>
            )}
            {Roles.userIsInRole(userId, RolesEnum.MANAGER) && (
              <AutoForm onSubmit={this.onFlagRepond} schema={respondSchema}>
                <div className="form-wrapper">
                  <b>Flagging reason</b>
                  <div>{selectedFlag.flagReason}</div>
                </div>
                <div className="form-wrapper">
                  <LongTextField
                    labelHidden={true}
                    placeholder="Type to respond"
                    name="flagResponse"
                  />
                  <ErrorField name="flagResponse" />
                  <div className="check-group">
                    <input checked={isFlagApproved} type="checkbox" />
                    <label onClick={this.handleFlagApproval}>
                      Mark flag correct
                    </label>
                  </div>
                </div>
                <div className="btn-group">
                  <button className="btn-cancel" onClick={this.onCloseDialog}>
                    Cancel
                  </button>
                  <button type="submit" className="btn--light-blue">
                    Confirm & send
                  </button>
                </div>
              </AutoForm>
            )}
          </Dialog>
        )}
      </div>
    );
  }
}

const flagSchema = new SimpleSchema({
  flagReason: {
    type: String
  }
});

const respondSchema = new SimpleSchema({
  flagResponse: {
    type: String
  }
});
