import React, { Component } from "react";
import UploadStatus from "/imports/api/files/enums/statuses";
import { getToken } from "../../../../../api/s3-uploads/utils";
import Notifier from "/imports/client/lib/Notifier";
import HeaderEdit from "./FileHeaderEdit";

export default class ReportHeader extends Component {
  constructor() {
    super();
    this.state = {
      isEditingHeaders: false
    };
  }

  onEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };
  getFileName = name => {
    return name.split(".")[0] || "";
  };

  onDownloadFile = () => {
    const { file } = this.props;
    window.open("/file/" + file._id + "/" + getToken(), "_blank");
  };

  onOpenDialog = () => {
    this.setState({ isEditingHeaders: true });
  };

  onCloseDialog = () => {
    this.setState({ isEditingHeaders: false });
  };

  onDismissFile = () => {
    const { file } = this.props;
    Meteor.call("file.dismiss", file._id, err => {
      if (!err) {
        Notifier.success("File Dismissed!");
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  onRetryUpload = () => {
    const { file } = this.props;
    console.log(file);
    Meteor.call("file.retryUpload", file.fileName, file._id, err => {
      if (!err) {
        Notifier.success("Job Created");
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  render() {
    const { file } = this.props;
    const { isEditingHeaders } = this.state;

    const styles = {
      backgroundColor: file.status === UploadStatus.SUCCESS ? "green" : "red"
    };
    return (
      <div className="main-content__header header-block">
        <div className="row__header">
          <div className="text-light-grey">File name</div>
          <div className="title">{this.getFileName(file.fileName)}</div>
        </div>
        <div className="row__header">
          <div className="placement-block">
            <div className="text-light-grey">Upload Status</div>
            <div style={styles} className="label label--grey text-uppercase">
              {file.status}
            </div>
          </div>
          <button style={{ color: "black" }} onClick={this.onDownloadFile}>
            Download
          </button>
          {file.status === UploadStatus.FAIL && (
            <button style={{ color: "black" }} onClick={this.onDismissFile}>
              Dismiss
            </button>
          )}

          <button style={{ color: "black" }} onClick={this.onOpenDialog}>
            Edit headers
          </button>

          <button style={{ color: "black" }} onClick={this.onRetryUpload}>
            Retry Upload
          </button>

          {isEditingHeaders && (
            <HeaderEdit file={file} onCloseDialog={this.onCloseDialog} />
          )}
        </div>
      </div>
    );
  }
}
