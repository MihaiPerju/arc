import React from "react";
import {
  AutoForm,
  AutoField,
  ErrorField,
  LongTextField
} from "/imports/ui/forms";
import CodesSchema from "/imports/api/codes/schemas/schema";
import Notifier from "/imports/client/lib/Notifier";

export default class CodeEdit extends React.Component {
  constructor() {
    super();

    this.state = {
      error: null,
      isDisabled: false
    };
  }

  onSubmit(formData) {
    const { code, setEdit } = this.props;
    this.setState({ isDisabled: true });
    Meteor.call("code.edit", code._id, formData, err => {
      if (!err) {
        Notifier.success("Data saved !");
        setEdit();
      } else {
        Notifier.error("An error occurred!");
      }
      this.setState({ isDisabled: false });
    });
  }

  onEditCode = () => {
    const { form } = this.refs;
    form.submit();
  };

  onSetEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };

  render() {
    const { code } = this.props;
    const { isDisabled } = this.state;

    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onSetEdit} className="btn-cancel">
              Cancel
            </button>
            <button
              style={isDisabled ? { cursor: "not-allowed" } : {}}
              disabled={isDisabled}
              onClick={this.onEditCode}
              className="btn--green"
            >
              Confirm & save
            </button>
          </div>
        </div>

        <div className="create-form__wrapper">
          <div className="action-block">
            <div className="header__block">
              <div className="title-block text-uppercase">Code information</div>
            </div>
            <AutoForm
              schema={CodesSchema}
              onSubmit={this.onSubmit.bind(this)}
              ref="form"
              model={code}
            >
              {this.state.error && (
                <div className="error">{this.state.error}</div>
              )}
              <div className="form-wrapper">
                <AutoField labelhidden={true} placeholder="Code" name="code" />
                <ErrorField name="code" />
              </div>

              <div className="form-wrapper">
                <AutoField
                  labelhidden={true}
                  placeholder="Action"
                  name="action"
                />
                <ErrorField name="action" />
              </div>

              <div className="select-group b-b--0 p-b--0">
                <div className="form-wrapper m-b--0">
                  <AutoField
                    labelhidden={true}
                    placeholder="Type"
                    name="type"
                  />
                  <ErrorField name="type" />
                </div>
              </div>

              <div className="form-wrapper">
                <AutoField
                  labelhidden={true}
                  placeholder="Description"
                  name="description"
                />
                <ErrorField name="description" />
              </div>

              <div className="form-wrapper">
                <AutoField
                  labelhidden={true}
                  placeholder="Short Description"
                  name="description_short"
                />
                <ErrorField name="description_short" />
              </div>

              <div className="form-wrapper">
                <LongTextField
                  labelhidden={true}
                  placeholder="Denial Action"
                  name="denial_action"
                />
                <ErrorField name="denial_action" />
              </div>
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}
