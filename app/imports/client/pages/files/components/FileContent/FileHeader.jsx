import React, { Component } from "react";
import UploadStatus from "/imports/api/files/enums/statuses";

export default class ReportHeader extends Component {
  onEdit = () => {
    const { setEdit } = this.props;
    setEdit();
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
          <div className="title">{file.fileName}</div>
        </div>
        <div className="row__header">
          <div className="placement-block">
            <div className="text-light-grey">Upload Status</div>
            <div style={styles} className="label label--grey text-uppercase">
              {file.status}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
