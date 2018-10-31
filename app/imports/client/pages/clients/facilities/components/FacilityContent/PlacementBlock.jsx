import React, {Component} from 'react';
import Notifier from "../../../../../lib/Notifier";
import DropzoneComponent from 'react-dropzone-component';
import ImportingRules from '../ImportingRules';
import { getToken } from "/imports/api/uploads/utils";
import DatePicker from "react-datepicker";
import moment from "moment";

export default class PlacementBlock extends Component {

    constructor() {
        super();
        this.state = {
          placementDate: moment()
        };
      }

    onDateSelect = selectedDate => {
        this.setState({ placementDate: selectedDate });
      };

    render() {
        const {facility, setTempRules} = this.props;
        const {placementDate} = this.state;
        const componentConfig = {
            postUrl: `/uploads/csv/${facility._id}/${getToken()}`
        };

        const djsConfig = {
            complete(file) {
                Notifier.success('Added');
                this.removeFile(file);
            },
            acceptedFiles: '.csv'
        };

        return (
            <div className="action-block drop-file">
                <div className="header__block">
                    <div className="title-block text-uppercase">Placement file</div>
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
                        selected={placementDate}
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
                </div>
                <div className="upload-section">
                    <ImportingRules rules={"placementRules"} model={facility} setTempRules={setTempRules}/>
                </div>
            </div>
        )
    }
}