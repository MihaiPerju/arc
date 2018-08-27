import React, { Component } from "react";
import Dialog from "/imports/client/lib/ui/Dialog";
import FileTypes from "/imports/api/files/enums/fileTypes";
import { SimpleSchema } from "simpl-schema/dist/SimpleSchema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";

export default class FileHeaderEdit extends Component {
  constructor() {
    super();
    this.state = {
      model: {},
      schema: null
    };
  }

  componentDidMount() {
    const { file } = this.props;
    Meteor.call("file.getHeader", file._id, (err, res) => {
      if (!err) {
        const model = {};
        res.map((element, index) => {
          model[index] = element;
        });
        this.createSchema(res);
        this.setState({ model });
      } else {
        console.log(err);
      }
    });
  }

  createSchema = data => {
    const config = {};
    data.map((element, index) => {
      config[index] = {
        type: String
      };
    });
    this.setState({ schema: new SimpleSchema(config) });
  };

  closeDialog = () => {
    const { onCloseDialog } = this.props;
    onCloseDialog();
  };

  onConfirm = () => {
    const { form } = this.refs;
    form.onSubmit();
  };

  onSubmit = data => {
    const { file, onCloseDialog } = this.props;
    const header = [];
    for (let index in data) {
      header.push(data[index]);
    }
    Meteor.call("file.updateHeader", file._id, header, err => {
      if (!err) {
        Notifier.success("Header updated");
        onCloseDialog();
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  render() {
    const { model, schema } = this.state;
    return (
      <div>
        <Dialog
          title="Edit File Header"
          className="account-dialog"
          closePortal={this.closeDialog}
        >
          <div className="form-wrapper">Change File Headers</div>
          {schema && (
            <AutoForm
              ref="form"
              model={model}
              schema={schema}
              onSubmit={this.onSubmit}
            >
              {schema._schemaKeys.map(key => {
                return (
                  <div key={key}>
                    <AutoField name={key} />
                    <ErrorField name={key} />
                  </div>
                );
              })}
            </AutoForm>
          )}

          <div className="btn-group">
            <button className="btn-cancel" onClick={this.closeDialog}>
              Cancel
            </button>
            <button className="btn--light-blue" onClick={this.onConfirm}>
              Confirm & delete
            </button>
          </div>
        </Dialog>
      </div>
    );
  }
}
