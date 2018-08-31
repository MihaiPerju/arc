import React from 'react';
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';

export default class Settings extends React.Component {
  constructor () {
    super ();
    this.state = {
      model: {},
    };
  }

  componentWillMount () {
    Meteor.call ('admin.getRootFolder', (err, model) => {
      if (!err) {
        this.setState ({model});
      } else {
        Notifier.error (err.reason);
      }
    });
  }

  onSubmit (data) {
    Meteor.call ('admin.updateRootFolder', data, err => {
      if (!err) {
        Notifier.success ('Settings updated!');
      } else {
        Notifier.error (err.reason);
      }
    });
  }

  render () {
    const {model} = this.state;
    return (
      <div className="settings-container flex--helper flex-align--center flex-justify--center">
        <div className="settings-container__wrapper text-center">
          <i className="icon-cog" />
          <h2>Admin Settings</h2>
          <AutoForm className="settings-form" model={model} onSubmit={this.onSubmit} schema={schema}>
            <AutoField
              labelhidden={true}
              name="rootFolder"
              placeholder="Type Root Directory"
            />
            <ErrorField name="rootFolder" />
            <div className="btn-group">
              <button className="btn--green">Save</button>
            </div>
          </AutoForm>
        </div>
      </div>
    );
  }
}

const schema = new SimpleSchema ({
  rootFolder: {
    type: String,
    optional: true,
  },
});
