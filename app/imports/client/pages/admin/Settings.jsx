import React from "react";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";
import Notifier from "/imports/client/lib/Notifier";

export default class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      model: {}
    };
  }

  componentWillMount() {
    Meteor.call("admin.getRootFolder", (err, model) => {
      if (!err) {
        this.setState({ model });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  onSubmit(data) {
    Meteor.call("admin.updateRootFolder", data, err => {
      if (!err) {
        Notifier.success("Settings updated!");
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  render() {
    const { model } = this.state;
    return (
      <div>
        Admin Settings
        <AutoForm model={model} onSubmit={this.onSubmit} schema={schema}>
          <AutoField
            labelHidden={true}
            name="rootFolder"
            placeholder="Type Root Directory"
          />
          <ErrorField name="rootFolder" />
          <button>Save</button>
        </AutoForm>
      </div>
    );
  }
}

const schema = new SimpleSchema({
  rootFolder: {
    type: String,
    optional: true
  }
});
