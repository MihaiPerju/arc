import React, { Component } from "react";
import SimpleSchema from "simpl-schema";
import { AutoForm, AutoField, ErrorField, SelectField } from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";
import DropzoneComponent from "react-dropzone-component";
import { getToken } from "/imports/api/uploads/utils";
import workQueueQuery from "/imports/api/tags/queries/listTags";
import { moduleNames } from "/imports/api/tags/enums/tags";
import WorkQueueService from "/imports/client/pages/accounts/services/WorkQueueService";
import pages from "/imports/api/bulk/enums/pages";
import jobStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses"; 


export default class AssignByWorkQueue extends Component {
  constructor() {
    super();
    this.state = {
      model: {},
      workQueueOptions: [],
      workQueueId: "",
      queueStatus: false,
      clientId: "",
      clientOptions: [],
    }
    this.getStatus = null;
  }

  componentWillMount() {
    Meteor.call("client.getAll",(err, clients) => {
      if(!err) {
        const clientOptions = this.clientOptions(clients);
        this.setState({
          clientOptions
        });
      }
    });

    /*  workQueueQuery
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
      });  */
  }
  
  componentDidMount() {
    this.getStatus = setInterval(() => {
      this.getJobQueueStatus();
    }, 3000);
  }

  clientOptions = (data) => {
    let clientQueues = [];
    for (let client of data) {
      clientQueues.push({ value: client._id, label: client.clientName });
    }
    return clientQueues;
  }

  onHandleChange(field, value) {
    if(field == "clientId") {
      if (value) {
        Meteor.call("client.getWorkQueue", value, (err, workQueueOptions) => {
           if (!err) {
            this.setState({ workQueueOptions });
          } else {
            this.setState({ workQueueOptions: [] });
          } 
        });
      } else {
        this.setState({ workQueueOptions: [] });
      }
    }
    if (field == 'workQueueId') { this.setState({ workQueueId: value }); }
    if (field == 'clientId') { this.setState({ clientId: value, workQueueId: "" }); }
  }

  getJobQueueStatus = () => {
    this.setState({ queueStatus: false });
    Meteor.call("jobQueue.assignByUser", pages.ASSIGN_WORKQUEUE, (err, queueResult) => {
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
    const { model, workQueueId, workQueueOptions, queueStatus, clientId, clientOptions } = this.state;
    const componentConfig = {
      postUrl: `/uploads/assignBulkUpload/${getToken()}`
    };
    const djsConfig = {
      params: {
        assignType: pages.ASSIGN_WORKQUEUE,
        workQueueId: workQueueId
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
      <div className={this.state.fade ? "new-action in" : "new-action"}>
        <div className="create-form position_style">
          {queueStatus ? (<div className="create-form__bar">
            <div className="text-light-grey">Assign Status : </div>
            <div className="label label--grey text-uppercase" style={{ "backgroundColor": "orange" }}>In Progress</div>
          </div>) : null}
          <AutoForm
            schema={schema}
            onChange={this.onHandleChange.bind(this)}
            model={model}
          >
            <div className="main-content m-t--10">
              <div className="header-block header-account">
                <div className="additional-info account-info">
                  <div className="select-wrapper select_div dropdown-icon">
                    <div className="select_label">Select Client :</div>
                    <div className="select-form border-style">
                      <SelectField
                        name="clientId"
                        labelHidden={true}
                        options={clientOptions}
                        placeholder="Select Client"
                        value={clientId}
                      />
                      <ErrorField name="clientId" />
                    </div>
                  </div>
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
          {overlayTag}
        </div>
      </div>
    )
  }

}

const schema = new SimpleSchema({
  workQueueId: {
    type: String,
    optional: true
  },
  clientId: {
    type: String,
    optional: true
  }
});