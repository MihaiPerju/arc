import React, {Component} from 'react';
import Notifier from "../../../../../lib/Notifier";
import DropzoneComponent from 'react-dropzone-component';
import ImportingRules from '../ImportingRules';
import {getToken} from "/imports/api/uploads/utils";
import DatePicker from "react-datepicker";
import moment from "moment";
import fileTypes from "/imports/api/files/enums/fileTypes";
import jobStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";

export default class InventoryBlock extends Component {

    constructor() {
        super();
        this.state = {
          placementDate: new Date(),
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
          fileType: fileTypes.INVENTORY,
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

      onDateSelect = selectedDate => {
        this.setState({ placementDate: selectedDate });
      };

    copyRules = () => {
        const {copyPlacementRules} = this.props;
        copyPlacementRules();
    };

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
        const {facility, resetImportForm, changeResetStatus} = this.props;
        const componentConfig = {
            postUrl: `/uploads/inventory/${facility && facility._id}/${getToken()}`
        };
        const {placementDate} = this.state;

        const djsConfig = {
            params: {
                placementDate: this.state.placementDate
            },
            complete(file) {
                Notifier.success('Added');
                this.removeFile(file);
            },
            acceptedFiles: '.csv'
        };

        return (
            <div className="action-block drop-file">
                <div className="header__block">
                    <div className="title-block text-uppercase">Inventory File {this.getLastUpdate()} </div>
                </div>

                <div className="upload-section">
                    <div className="radio-group flex--helper flex-align--center">
                        <label>Account Placement Date:</label>
                        <DatePicker
                        calendarClassName="cc-datepicker"
                        showMonthDropdown
                        showYearDropdown
                        todayButton={"Today"}
                        placeholderText="Account Placement Date"
                        selected={moment(placementDate)}
                        name="placementDate"
                        onChange={date =>
                            this.onDateSelect(date, "placementDate")
                        }
                        />
                    </div>
                  </div>

                <div className="main__block">
                    <div className="add-content">
                        <i className="icon-upload"/>
                        <DropzoneComponent config={componentConfig} djsConfig={djsConfig}/>
                    </div>
                    <div className="upload-section">
                        <ImportingRules rules={"inventoryRules"}
                                        model={facility}
                                        resetImportForm={resetImportForm}
                                        changeResetStatus={changeResetStatus}
                                        copyRules={this.copyRules}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
