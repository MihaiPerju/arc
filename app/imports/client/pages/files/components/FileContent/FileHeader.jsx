import React, { Component } from "react";
import UploadStatus from "/imports/api/files/enums/statuses";
import { getToken } from "../../../../../api/uploads/utils";
import Notifier from "/imports/client/lib/Notifier";
import HeaderEdit from "./FileHeaderEdit";

export default class ReportHeader extends Component {
  constructor() {
    super();
    this.state = {
      isEditingHeaders: false,
      showDetail: false
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
      Meteor.call("file.retryUpload", file.fileName, file._id, (err, ret) => {
        if (!err) {
          if(ret === 'FILE_NOT_AVAILABLE'){
            Notifier.success("File not availble");
          }else{
            Notifier.success("Job Created");
          }
        } else {
          Notifier.error(err.reason);
        }
      });
  };

  showMore = () => {
    this.setState({ showDetail: !this.state.showDetail });
  }

  render() {
    const { file } = this.props;
    const { isEditingHeaders, showDetail } = this.state;

    const styles = {
      backgroundColor:
        file && file.status === UploadStatus.SUCCESS ? "green" : "red"
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
              {file && file.status}
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

          <button style={{ color: "black" }} onClick={this.onRetryUpload}>
            Retry Upload
          </button>

          {isEditingHeaders && (
            <HeaderEdit file={file} onCloseDialog={this.onCloseDialog} />
          )}
          
          {file && file.corruptRows && file.corruptRows.length ? (
            <div style={{width:'100%'}} >
              <div className="placement-block" style={{alignItems: 'center'}} >
                <div className="text-light-grey">The Number of error rows: {file.corruptRows.length} </div>
                  <button style={{ margin: '5px', padding: '6px' }} onClick={this.showMore}>
                    {showDetail ? 'Show Less' : 'Show More' }
                    <i style={{ margin : '0px 5px'}} className={showDetail ? 'icon-angle-up' : 'icon-angle-down' } />
                  </button>
              </div>
                { showDetail && 
                  (
                    <div className="placement-block report-content" style={{height:'400px'}} >
                      <div>Encountered problems with following rows: </div>
                        <div className="table-list margin-top-20">
                          <div className="table-container flex--helper" >
                            <div className="table-container__left" style={{height: '100%', 'overflow-y': 'scroll'}} >
                              {file.corruptRows.map((row) => {
                                  return  <div className="table-field truncate" style={{border: '1px #d7d7d7 solid'}}> Row: {row}</div>
                                })}
                            </div>
                          </div>
                      </div>  
                    </div>
                  )
                }
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
