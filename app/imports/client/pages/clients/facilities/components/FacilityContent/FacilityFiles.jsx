import React, { Component } from "react";
import Notifier from "/imports/client/lib/Notifier";
import Dialog from "/imports/client/lib/ui/Dialog";
import Loading from "/imports/client/lib/ui/Loading";

export default class FacilityFiles extends Component {
  constructor() {
    super();
    this.state = {
      dialogIsActive: false,
      isDisabled: false
    };
  }

  componentWillMount() {
    this.getFiles();
  }

  getFiles = () => {
    const { facilityId } = this.props;
    Meteor.call("files.getLastSevenDays", { facilityId }, (err, files) => {
      if (!err) {
        this.setState({ files });
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  onRollBack = () => {
    const { _id } = this.state;

    Meteor.call("file.rollback", _id, err => {
      if (!err) {
        Notifier.success("File reverted");
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  };

  closeDialog = () => {
    this.setState({
      dialogIsActive: false
    });
  };

  confirmDelete = () => {
    this.setState({
      dialogIsActive: false,
      isDisabled: true
    });
    this.onRollBack();
  };

  deleteAction = _id => {
    this.setState({
      dialogIsActive: true,
      _id
    });
  };

  getFileName(name) {
    let firstIndex = name.indexOf(".");
    name = name.substr(0, firstIndex) + name.substr(firstIndex + name.length);
    return name;
  }

  render() {
    const { dialogIsActive, isDisabled, files } = this.state;

    if (!files) {
      return <Loading />;
    }

    return (
      <div className="action-block schedule-block">
        <div className="header__block">
          <div className="title-block text-uppercase">Last Uploaded File</div>
        </div>
        <div className="main__block">
          <div className="schedule-list">
            {files.length ? (
              files.map((file, index) => {
                return (
                  <div key={index} className="schedule-item">
                    <div className="left__side">
                      <div className="info">
                        <div className="text-light-grey">File Name</div>
                        <div className="info-label">
                          {this.getFileName(file.fileName)}
                        </div>
                      </div>
                    </div>
                    <div className="btn-group">
                      <button
                        style={isDisabled ? { cursor: "not-allowed" } : {}}
                        disabled={isDisabled}
                        onClick={this.deleteAction.bind(this, file._id)}
                        className="btn-cancel"
                      >
                        {isDisabled ? (
                          <div>
                            {" "}
                            Loading
                            <i className="icon-cog" />
                          </div>
                        ) : (
                          "Roll Back"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="schedule-item">
                <div className="left__side">
                  <div className="info">
                    <div className="info-label">No Backup available</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {dialogIsActive && (
          <Dialog
            className="account-dialog"
            closePortal={this.closeDialog}
            title="Confirm Rollback"
          >
            <div className="form-wrapper">
              Are you sure you want to revert all the changes?
            </div>
            <div className="btn-group">
              <button className="btn-cancel" onClick={this.closeDialog}>
                Cancel
              </button>
              <button className="btn--light-blue" onClick={this.confirmDelete}>
                Confirm & delete
              </button>
            </div>
          </Dialog>
        )}
      </div>
    );
  }
}
