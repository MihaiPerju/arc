import React, { Component } from "react";
import Notifier from "../../../../../lib/Notifier";
import DropzoneComponent from "react-dropzone-component";
import ImportingRules from "../ImportingRules";
import { getToken } from "/imports/api/uploads/utils";
import fileTypes from "/imports/api/files/enums/fileTypes";
import jobStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";

export default class PaymentBlock extends Component {

  constructor() {
    super();
    this.state = {
      lastUploadStatus : ''
    };
    this.getStatus = null;
  }

  componentDidMount() {
    this.getStatus = setInterval(() => {
      this.getJobQueueStatus();
    }, 3000);
  }

  getJobQueueStatus = () => {
    const filters = {
      fileType: fileTypes.PAYMENT,
      facilityId: this.props.facility._id
    }
    Meteor.call("jobQueue.getLastJob", filters, (err, res) => {
      if (!err) {
        if(res && res.status == jobStatuses.FINISHED){
          this.setState({lastUploadStatus: 'Completed'});
        } else if(res && res.status != jobStatuses.FINISHED) {
          this.setState({lastUploadStatus: 'In progress'});
        }else{
          this.setState({lastUploadStatus: ''});
        } 
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  componentWillUnmount = () => {
    clearInterval(this.getStatus);
  }

  getLastUpdate = () => {
    const { lastUploadStatus } = this.state;
    if(lastUploadStatus == '') { return null; }
    let statusColor = { "backgroundColor": "orange" };
    if(lastUploadStatus == 'Completed' ) {
      statusColor = { "backgroundColor": "green" };
    }
    return (
      <div className="float-right">
      <label>Last upload status : </label>
      <div className="label label--grey text-uppercase" style={statusColor}> {lastUploadStatus}</div>
      </div>);
  }

  render() {
    const { facility } = this.props;
    const componentConfig = {
      postUrl: `/uploads/payment/${facility && facility._id}/${getToken()}`
    };

    const djsConfig = {
      complete(file) {
        Notifier.success("Added");
        this.removeFile(file);
      },
      acceptedFiles: ".csv"
    };
    return (
      <div className="action-block drop-file">
        <div className="header__block">
          <div className="title-block text-uppercase">Payment File {this.getLastUpdate()} </div>
          
        </div>
        <div className="main__block">
          <div className="add-content">
            <i className="icon-upload" />
          </div>
          <div className="upload-list">
            <DropzoneComponent config={componentConfig} djsConfig={djsConfig} />
          </div>
        </div>
        <div className="upload-section">
          <ImportingRules rules={"paymentRules"} model={facility} />
        </div>
      </div>
    );
  }
}
