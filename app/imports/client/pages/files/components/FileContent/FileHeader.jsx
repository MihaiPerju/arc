import React, { Component } from "react";
import UploadStatus from "/imports/api/files/enums/statuses";
import { getToken } from "../../../../../api/s3-uploads/utils";

export default class ReportHeader extends Component {
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

  render() {
    const { file } = this.props;
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
        </div>
      </div>
    );
  }
}
