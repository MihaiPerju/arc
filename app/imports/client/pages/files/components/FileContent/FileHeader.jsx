import React, { Component } from "react";
import UploadStatus from "/imports/api/files/enums/statuses";
import { getToken } from "../../../../../api/uploads/utils";
import Notifier from "/imports/client/lib/Notifier";
import HeaderEdit from "./FileHeaderEdit";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import jobQueueQuery from "/imports/api/jobQueue/queries/listJobQueues";

class ReportHeader extends Component {
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
    return (name && name.split(".")[0]) || "";
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
    Meteor.call("file.retryUpload", file.fileName, file._id, err => {
      if (!err) {
        Notifier.success("Job Created");
      } else {
        Notifier.error(err.reason);
      }
    });
  };

getRetryButton = workerId => {
  if(this.props.data.length > 0 && !workerId) {
   return (
      <button disabled onClick={this.onRetryUpload} style={{cursor: 'not-allowed'}} >
        Retry Upload
      </button>
    );
  } else {
   return (
      <button onClick={this.onRetryUpload} >
      Retry Upload
    </button>
    );
  }
}

  render() {
    const { file, data } = this.props;
    const { isEditingHeaders } = this.state;
    const job = data[data.length - 1];
    const styles = {
      backgroundColor:
      (data.length > 0 && !job.workerId) ? 'orange' : file && file.status === UploadStatus.SUCCESS ? "green" : "red"
    };
    return (
      <div className="main-content__header header-block">
        <div className="row__header">
          <div className="text-light-grey">File name</div>
          <div className="title">{this.getFileName(file && file.fileName)}</div>
        </div>
        <div className="row__header">
          <div className="placement-block">
            <div className="text-light-grey">Upload Status</div>
            <div style={styles} className="label label--grey text-uppercase">
              {(data.length > 0 && !job.workerId) ? UploadStatus.REUPLOAD : file && file.status}
            </div>
          </div>
          <button style={{ color: "black" }} onClick={this.onDownloadFile}>
            Download
          </button>
          {file &&
            file.status === UploadStatus.FAIL && (
              <button style={{ color: "black" }} onClick={this.onDismissFile}>
                Dismiss
              </button>
            )}

          {file &&
            file.hasHeader && (
              <button style={{ color: "black" }} onClick={this.onOpenDialog}>
                Edit headers
              </button>
            )}

           {this.getRetryButton(job ? job.workerId : false ) }

          {isEditingHeaders && (
            <HeaderEdit file={file} onCloseDialog={this.onCloseDialog} />
          )}
          {file && file.corruptRows && file.corruptRows.length ? (
            <div>
              <div>Encountered problems with following rows: </div>
              <ul>
                {file.corruptRows.map((row,index) => {
                  return <li key={index}>{row}</li>;
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default withQuery(
  props => {
    return jobQueueQuery.clone({ filters: { fileId: props.file._id } });
  },
  { reactive: true }
)(ReportHeader);
