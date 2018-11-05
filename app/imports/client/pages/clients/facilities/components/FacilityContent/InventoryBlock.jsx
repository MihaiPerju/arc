import React, {Component} from 'react';
import Notifier from "../../../../../lib/Notifier";
import DropzoneComponent from 'react-dropzone-component';
import ImportingRules from '../ImportingRules';
import {getToken} from "/imports/api/uploads/utils";
import DatePicker from "react-datepicker";
import moment from "moment";

export default class InventoryBlock extends Component {

    constructor() {
        super();
        this.state = {
          placementDate: new Date()
        };
      }

      onDateSelect = selectedDate => {
        this.setState({ placementDate: selectedDate });
      };

    copyRules = () => {
        const {copyPlacementRules} = this.props;
        copyPlacementRules();
    };

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
                    <div className="title-block text-uppercase">Inventory File</div>
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