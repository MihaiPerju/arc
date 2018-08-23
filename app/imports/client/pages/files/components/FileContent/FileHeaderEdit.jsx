import React, { Component } from "react";
import Dialog from "/imports/client/lib/ui/Dialog";
import FileTypes from "/imports/api/files/enums/fileTypes";

export default class FileHeaderEdit extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const { file } = this.props;
    Meteor.call("file.getHeader", file._id, (err, res) => {
      if (!err) {
        console.log(res);
      } else {
        console.log(err);
      }
    });
  }

  closeDialog = () => {
    const { onCloseDialog } = this.props;
    onCloseDialog();
  };

  onConfirm = () => {
    console.log("OK!");
  };

  render() {
    return (
      <div>
        <Dialog
          title="Edit File Header"
          className="account-dialog"
          closePortal={this.closeDialog}
        >
          <div className="form-wrapper">Change File Headers</div>
          <div className="btn-group">
            <button className="btn-cancel" onClick={this.closeDialog}>
              Cancel
            </button>
            <button className="btn--light-blue" onClick={this.onConfirm}>
              Confirm & delete
            </button>
          </div>
        </Dialog>
      </div>
    );
  }
}
