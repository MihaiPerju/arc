import React, { Component } from "react";
import SimpleSchema from "simpl-schema";
import { AutoForm, AutoField, ErrorField, SelectField } from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";
import DropzoneComponent from "react-dropzone-component";
import { getToken } from "/imports/api/uploads/utils";
import workQueueQuery from "/imports/api/tags/queries/listTags";
import { moduleNames } from "/imports/api/tags/enums/tags";
import WorkQueueService from "/imports/client/pages/accounts/services/WorkQueueService";


export default class AssignByWorkQueue extends Component {
  constructor() {
    super();
    this.state = {
      model: {},
      workQueueOptions: [],
      workQueueId: ""
    }
  }

  componentWillMount() {
    workQueueQuery
      .clone({
        filters: {
          entities: { $in: [moduleNames.WORK_QUEUE] }
        }
      })
      .fetch((err, res) => {
        if (!err) {
          const workQueueOptions = WorkQueueService.createOptions(res);
          this.setState({
            workQueueOptions
          });
        }
      });
  }

  onHandleChange(field, value) {
    if (field == 'workQueueId') { this.setState({ workQueueId: value }); }
  }

  render() {
    const { model, workQueueId, workQueueOptions } = this.state;
    const componentConfig = {
      postUrl: `/uploads/assignBulkUpload/${getToken()}`
    };
    const djsConfig = {
      params: {
        assignType: 'assign_by_group',
        workQueueId: workQueueId
      },
      complete(file) {
        Notifier.success("File Uploaded & Update Successfully");
        this.removeFile(file);
      },
      acceptedFiles: ".csv"
    };
    return (
      <div className={this.state.fade ? "new-action in" : "new-action"}>
        <div className="create-form">
          <AutoForm
            schema={schema}
            onChange={this.onHandleChange.bind(this)}
            model={model}
          >
            <div className="main-content m-t--10">
              <div className="header-block header-account">
                <div className="additional-info account-info">
                  <div className="select-wrapper select_div dropdown-icon">
                    <div className="select_label">Select Group :</div>
                    <div className="select-form border-style">
                      <SelectField
                        name="workQueueId"
                        labelHidden={true}
                        options={workQueueOptions}
                        placeholder="Select Group"
                        value={workQueueId}
                      />
                      <ErrorField name="workQueueId" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
            <div className="select-row">
              {workQueueId && workQueueId != 'Unassigned' &&
                <div className="select-row">
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
                </div>
              }
            </div>
          </AutoForm>
        </div>
      </div>
    )
  }

}

const schema = new SimpleSchema({
  workQueueId: {
    type: String,
    optional: true,
    label: "Select Work Queue"
  }
});