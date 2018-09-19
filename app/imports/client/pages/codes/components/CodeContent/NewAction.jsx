import React, { Component } from "react";
import SimpleSchema from "simpl-schema";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import SelectSimple from "/imports/client/lib/uniforms/SelectSimple.jsx";

const ActionSchema = new SimpleSchema({
  action: {
    type: String,
    optional: true
  }
});

export default class NewAction extends Component {
  constructor() {
    super();
    this.state = {
      fade: false,
      actions: []
    };
  }

  getActionOptions(actions) {
    return _.map(actions, ({ _id, title }) => {
      const value = title;
      return { value: _id, label: value };
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ fade: true });
    }, 1);
  }

  onHide = e => {
    const { hide } = this.props;
    hide();
  };

  render() {
    const actions = this.getActionOptions(this.state.actions);
    return (
      <div className={this.state.fade ? "new-action in" : "new-action"}>
        <div className="action-info">
          <img
            className="md-avatar img-circle"
            src="/assets/img/user1.svg"
            alt=""
          />
          <div className="name truncate">Solomon Ben</div>
        </div>

        <div className="action-form">
          <AutoForm schema={ActionSchema} ref="form">
            <div className="select-row">
              <div className="select-group">
                <SelectSimple
                  labelHidden={true}
                  name="action"
                  options={actions}
                />
                <ErrorField name="action" />
              </div>
            </div>

            <div className="btn-group">
              <button type="button" className="btn--red" onClick={this.onHide}>
                Cancel
              </button>
              <button type="submit" className="btn--green">
                Save
              </button>
            </div>
          </AutoForm>
        </div>
      </div>
    );
  }
}
