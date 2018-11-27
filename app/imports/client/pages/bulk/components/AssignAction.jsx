import React, { Component } from "react";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import SelectSimple from "/imports/client/lib/uniforms/SelectSimple.jsx";
import SimpleSchema from "simpl-schema";
import Notifier from "/imports/client/lib/Notifier";
import reasonCodesQuery from "/imports/api/reasonCodes/queries/reasonCodesList";
import Loading from "/imports/client/lib/ui/Loading";
import ActionsHelper from "/imports/api/actions/helpers/OptionsGenerator";
import ReasonCodesHelper from "/imports/api/reasonCodes/helpers/OptionsGenerator";
import DateField from "/imports/client/lib/uniforms/DateField";
import requirementTypes from "/imports/api/actions/enums/requirementEnum";
import DropzoneComponent from "react-dropzone-component";
import { getToken } from "/imports/api/uploads/utils";
import pages from "/imports/api/bulk/enums/pages";
import jobStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";

export default class AssignAction extends Component {
  constructor() {
    super();
    this.state = {
      fade: false,
      actions: [],
      reasonCodes: [],
      loading: true,
      selectedActionId: null,
      isDisabled: false,
      customFieldValue: {},
      queueStatus: false,
      reasonCode: false
    };
    let selVal = {};
    this.getStatus = null;
  }

  componentWillMount() {
    Meteor.call("actions.get", (err, actions) => {
      if (!err) {
        this.setState({
          actions,
          loading: false
        });
      }
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ fade: true });
    }, 1);
    this.getStatus = setInterval(() => {
      this.getJobQueueStatus();
    }, 3000);
  }


  onSubmit(data) { }

  getJobQueueStatus = () => {
    this.setState({ queueStatus: false });
    Meteor.call("jobQueue.assignByUser", pages.ASSIGN_ACTION, (err, queueResult) => {
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

  onHandleChange = (field, value) => {
    let selVal = {}
    if (field == "actionId") {
      reasonCodesQuery
        .clone({
          filters: {
            actionId: value.value
          }
        })
        .fetch((err, reasonCodes) => {
          if (!err) {
            this.setState({
              reasonCodes
            });
          }
        });
      this.setState({ selectedActionId: value, reasonCode: false });
    }
    if (field == "reasonCode") { this.setState({ [field]: value }) }
    if (this.state.selectedActionId) {
      selVal = { ...this.state.customFieldValue, [field]: value };
    } else {
      selVal = {}
    }
    this.setState({ customFieldValue: selVal });
  };

  onChange = (date, label) => {
    this.setState({ [label]: date });
  };

  onChangeNumber = e => {
    e = e || window.event;
    var charCode = typeof e.which == "undefined" ? e.keyCode : e.which;
    var charStr = String.fromCharCode(charCode);
    if (!charStr.match(/^[0-9]+$/) && charStr != ".") e.preventDefault();
  };

  getInputSingle = (input, index) => {
    if (input.type === "date") {
      return (
        <div className="custom-inputs" key={index}>
          <DateField label={input.label} name={input.label} key={index} />
          <ErrorField name={input.label} />
        </div>
      );
    } else if (input.type === "number") {
      return (
        <div className="custom-inputs" key={index}>
          <AutoField
            placeholder={input.label}
            name={input.label}
            pattern="[0-9]"
            onKeyPress={this.onChangeNumber}
            key={index}
          />
          <ErrorField name={input.label} />
        </div>
      );
    }
    return (
      <div className="custom-inputs" key={index}>
        <AutoField placeholder={input.label} name={input.label} key={index} />
        <ErrorField name={input.label} />
      </div>
    );
  };

  getSchema(action) {
    const schema = {
      actionId: {
        type: String,
        optional: true
      },
      reasonCode: {
        type: String,
        optional: true
      }
    };

    //Extend schema for inputs
    if (action && action.inputs) {
      for (let input of action.inputs) {
        let optional = input.requirement === requirementTypes.OPTIONAL;
        if (input.type === "date") {
          _.extend(schema, {
            [input.label]: {
              type: Date,
              optional
            }
          });
        } else if (input.type === "number") {
          _.extend(schema, {
            [input.label]: {
              type: Number,
              optional
            }
          });
        } else {
          _.extend(schema, {
            [input.label]: {
              type: String,
              optional
            }
          });
        }
      }
    }
    return new SimpleSchema(schema);
  }

  getParams = () => {
    let { selectedActionId, reasonCodes, customFieldValue } = this.state;

    let reqParams = {
      assignType: pages.ASSIGN_ACTION,
      actionId: JSON.stringify(selectedActionId)
    }
    if (customFieldValue) {
      reqParams.customFields = JSON.stringify(customFieldValue);
    }
    if (reasonCodes && reasonCodes.length != 0)
      reqParams.reasonCodes = reasonCodes

    let retParams = {
      params: reqParams,
      complete(file) {
        Notifier.success("File Uploaded Successfully");
        this.removeFile(file);
        this.getStatus = setInterval(() => {
          this.getJobQueueStatus;
        }, 3000);
      },
      acceptedFiles: ".csv"
    }
    return retParams;
  }

  render() {
    const {
      selectedActionId,
      loading,
      isDisabled,
      actions,
      reasonCodes,
      queueStatus,
      reasonCode
    } = this.state;
    const actionOptions = ActionsHelper.generateOptions(actions);
    const reasonCodeOptions = ReasonCodesHelper.generateOptions(reasonCodes);
    const selectedAction = ActionsHelper.selectAction(
      selectedActionId && selectedActionId.value,
      actions
    );
    
    const schema = this.getSchema(selectedAction);

    const componentConfig = {
      postUrl: `/uploads/assignBulkUpload/${getToken()}`
    };
    const djsConfig = this.getParams();

    if (loading) {
      return <Loading />;
    }

    let overlayTag = queueStatus ? (<div className="overlay" />) : null;

    return (
      <div className={this.state.fade ? "new-action in" : "new-action"}>
        <div className="create-form position_style">
          {queueStatus ? (<div className="create-form__bar">
            <div className="text-light-grey">Assign Status : </div>
            <div className="label label--grey text-uppercase" style={{ "backgroundColor": "orange" }}>In Progress</div>
          </div>) : null}
          <AutoForm
            schema={schema}
            onSubmit={this.onSubmit.bind(this)}
            onChange={this.onHandleChange}
            ref="form"
            className="full-width"
          >

            <div className="main-content m-t--10">
              <div className="header-block header-account">
                <div className="additional-info account-info">

                  <div className="select-wrapper select_div dropdown-icon">
                    <div className="select_label">Action Id :</div>
                    <div className="select-form border-style">
                      <SelectSimple
                        name="actionId"
                        labelHidden={true}
                        options={actionOptions}
                        placeholder="actions"
                      />
                      <ErrorField name="actionId" />
                    </div>
                  </div>

                  {reasonCodeOptions.length > 0 && (
                    <div className="select-wrapper select_div dropdown-icon">
                      <div className="select_label">Reason Code :</div>
                      <div className="select-form border-style">
                        <SelectSimple
                          labelHidden={true}
                          name="reasonCode"
                          options={reasonCodeOptions}
                          value={reasonCode}
                        />
                        <ErrorField name="reasonCode" />
                      </div>
                    </div>
                  )}

                  <div className="custom-wrapper">
                    {selectedAction &&
                      selectedAction.inputs.map((input, index) => {
                        return this.getInputSingle(input, index);
                      })}
                  </div>

                </div>
              </div>
            </div>


            <div className="select-row">
              {/*      <div className="select-group">
                <SelectSimple
                  name="actionId"
                  labelHidden={false}
                  options={actionOptions}
                  placeholder="actions"
                />
                <ErrorField name="actionId" />
              </div> */}
              {/* reasonCodeOptions.length > 0 && (
                <div className="select-group">
                  <SelectSimple
                    labelHidden={true}
                    name="reasonCode"
                    options={reasonCodeOptions}
                  />
                  <ErrorField name="reasonCode" />
                </div>
              ) */}
              {/* <div className="custom-wrapper">
                {selectedAction &&
                  selectedAction.inputs.map((input, index) => {
                    return this.getInputSingle(input, index);
                  })}
              </div> */}
              {selectedActionId &&
                <div className="action-block drop-file">
                  <div className="main__block">
                    <div className="btn-group-1">
                      <div className="add-content">
                        <i className="icon-upload" />
                        <div className="drop-file__wrapper">
                          <DropzoneComponent config={componentConfig} djsConfig={djsConfig} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </AutoForm>
          {overlayTag}
        </div>
      </div>
    );
  }
}
