import React from "react";
import RuleSchema from "/imports/api/rules/schemas/schema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";
import RuleGenerator from "./components/RuleGenerator";
export default class RuleCreate extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  onSubmit(data) {
    console.log("At least called");
    data.clientId = FlowRouter.current().params.id;
    Meteor.call("rule.create", data, err => {
      if (!err) {
        Notifier.success("Rule added!");
        this.onClose();
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  onCreateRule = () => {
    const { form } = this.refs;
    console.log(form);
    form.submit();
  };

  onClose = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const schema = RuleSchema.omit("clientId");
    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onClose} className="btn-cancel">
              Cancel
            </button>
            <button onClick={this.onCreateRule} className="btn--green">
              Confirm & save
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
              <div className="form-wrapper">
                <AutoField
                  labelHidden={true}
                  placeholder="Description"
                  name="description"
                />
                <ErrorField name="description" />
              </div>

              <RuleGenerator name="rule" />
              <ErrorField name="rule" />
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}
