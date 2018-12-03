import React, { Component } from "react";
import SimpleSchema from "simpl-schema";
import { AutoForm, ErrorField, SelectField } from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";
import DropzoneComponent from "react-dropzone-component";
import { getToken } from "/imports/api/uploads/utils";
import pages from "/imports/api/bulk/enums/pages";
import jobStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";

export default class AssignByUser extends Component {
  constructor() {
    super();
    this.state = {
      model: {},
      facilitiesOption: [],
      userOptions: [],
      facilityType: "",
      userType: "",
      queueStatus: false
    };
    this.getStatus = null;
  }

  componentDidMount() {
    this.getFacilityByAccount();
    this.getStatus = setInterval(() => {
      this.getJobQueueStatus();
    }, 3000);
  }

  onSubmit(params) { }

  getFacilityByAccount = () => {
    Meteor.call("account.facility", {}, (err, facilitiesOption) => {
      if (!err) {
        this.setState({
          facilitiesOption
        });
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  onHandleChange(field, value) {
    if (field == "facilityId") {
      this.setState({ facilityType: value });
      if (value) {
        Meteor.call("account.facility.user", value, (err, userOptions) => {
          if (!err) {
            this.setState({ userOptions });
          } else {
            this.setState({ userOptions: [] });
          }
        });
      } else {
        this.setState({ userOptions: [] });
      }
    }
    if (field == "assigneeId") {
      this.setState({ userType: value });
    }
  }

  getJobQueueStatus = () => {
    this.setState({ queueStatus: false });
    Meteor.call("jobQueue.assignByUser", pages.ASSIGN_USER, (err, queueResult) => {
      if (!err) {
        if (queueResult && queueResult[0]) {
          let res = queueResult[0];
          if (res.status == jobStatuses.NEW) {
            this.setState({ queueStatus: true })
          }
        }
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  componentWillUnmount = () => {
    clearInterval(this.getStatus);
  }

  render() {
    const {
      model,
      facilitiesOption,
      userOptions,
      facilityType,
      userType,
      queueStatus
    } = this.state;
    const componentConfig = {
      postUrl: `/uploads/assignBulkUpload/${getToken()}`
    };
    const djsConfig = {
      params: {
        assignType: pages.ASSIGN_USER,
        facilityType: facilityType,
        userType: userType
      },
      complete(file) {
        Notifier.success("File Uploaded Successfully");
        this.removeFile(file);
        this.getStatus = setInterval(() => {
          this.getJobQueueStatus;
        }, 3000);
      },
      acceptedFiles: ".csv"
    };

    let overlayTag = queueStatus ? (<div className="overlay" />) : null;

    return (
      <div className="create-form position_style">
        {queueStatus ? (<div className="create-form__bar">
          <div className="text-light-grey">Assign Status : </div>
          <div className="label label--grey text-uppercase" style={{ "backgroundColor": "orange" }}>In Progress</div>
        </div>) : null}
        <AutoForm
          onSubmit={this.onSubmit.bind(this)}
          schema={schema}
          onChange={this.onHandleChange.bind(this)}
          model={model}
        >
          <div className="main-content m-t--10">
            <div className="header-block header-account">
              <div className="additional-info account-info">
                <div className="select-wrapper select_div dropdown-icon">
                  <div className="select_label">Select Facility :</div>
                  <div className="select-form border-style">
                    <SelectField
                      labelHidden={true}
                      name="facilityId"
                      placeholder="Select Facility"
                      options={facilitiesOption}
                      value={facilityType}
                    />
                    <ErrorField name="facilityId" />
                  </div>
                </div>

                <div className="select-wrapper select_div dropdown-icon">
                  <div className="select_label">Select Users :</div>
                  <div className="select-form border-style">
                    <SelectField
                      labelHidden={true}
                      name="assigneeId"
                      placeholder="Select Users"
                      options={userOptions}
                      value={userType}
                    />
                    <ErrorField name="assigneeId" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {facilityType && userType && (
            <div className="select-row">
              <div className="action-block drop-file">
                <div className="main__block">
                  <div className="btn-group-1">
                    <div className="add-content">
                      <i className="icon-upload" />
                      <div className="drop-file__wrapper">
                        <DropzoneComponent
                          config={componentConfig}
                          djsConfig={djsConfig}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AutoForm>
        {overlayTag}
      </div>
    );
  }
}

const schema = new SimpleSchema({
  facilityId: {
    type: String,
    optional: true,
    label: "Select Facility"
  },
  assigneeId: {
    type: String,
    optional: true,
    label: "Select User"
  }
});
