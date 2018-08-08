import React from "react";
import RegionSchema from "/imports/api/regions/schemas/schema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";

export default class RegionCreate extends React.Component {
  constructor() {
    super();

    this.state = { isDisabled: false };
  }

  onSubmit(data) {
    this.setState({ isDisabled: true });
    data.clientId = FlowRouter.current().params.id;
    Meteor.call("region.create", data, err => {
      if (!err) {
        Notifier.success("Region added!");
        this.onClose();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  }

  onCreateRegion = () => {
    const { form } = this.refs;
    form.submit();
  };

  onClose = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { isDisabled } = this.state;
    const schema = RegionSchema.omit("clientId");

    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onClose} className="btn-cancel">
              Cancel
            </button>
            <button
              style={isDisabled ? { cursor: "not-allowed" } : {}}
              disabled={isDisabled}
              onClick={this.onCreateRegion}
              className="btn--green"
            >
              Confirm & save {isDisabled && <i className="icon-cog" />}
            </button>
          </div>
        </div>
        <div className="create-form__wrapper">
          <div className="action-block i--block">
            <AutoForm
              schema={schema}
              onSubmit={this.onSubmit.bind(this)}
              ref="form"
            >
              {this.state.error && (
                <div className="error">{this.state.error}</div>
              )}
              <div className="form-wrapper">
                <AutoField labelHidden={true} placeholder="Name" name="name" />
                <ErrorField name="name" />
              </div>
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}
