import React from "react";
import {
  AutoForm,
  AutoField,
  ErrorField,
  SelectField
} from "/imports/ui/forms";
import TagsSchema from "/imports/api/tags/schemas/schema";
import Notifier from "/imports/client/lib/Notifier";

export default class TagEdit extends React.Component {
  constructor() {
    super();

    this.state = {
      error: null,
      isDisabled: false
    };
  }

  onSubmit(formData) {
    const { tag, setEdit } = this.props;
    this.setState({ isDisabled: true });
    Meteor.call("tag.edit", tag._id, formData, err => {
      if (!err) {
        Notifier.success("Tag saved !");
        setEdit();
      } else {
        Notifier.error("An error occurred!");
      }
      this.setState({ isDisabled: false });
    });
  }

  onEditTag = () => {
    const { form } = this.refs;
    form.submit();
  };

  onSetEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };

  getOptions = enums => {
    return _.map(enums, (value) => {
      return { value: value._id, label: value.clientName };
    });
  };

  render() {
    const { tag, clients } = this.props;
    const { isDisabled } = this.state;
    const clientOptns = this.getOptions(clients);

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
              onClick={this.onEditTag}
              className="btn--green"
            >
              {isDisabled ? (
                <div>
                  {" "}
                  Loading
                  <i className="icon-cog" />
                </div>
              ) : (
                "Confirm & Save"
              )}
            </button>
          </div>
        </div>

        <div className="create-form__wrapper">
          <div className="action-block">
            <div className="header__block">
              <div className="title-block text-uppercase">Tag information</div>
            </div>
            <AutoForm
              schema={TagsSchema}
              onSubmit={this.onSubmit.bind(this)}
              ref="form"
              model={tag}
            >
              <div className="form-wrapper">
                <AutoField labelHidden={true} placeholder="Name" name="name" />
                <ErrorField name="name" />
              </div>

              <div className="select-group">
                <div className="form-wrapper">
                  <SelectField
                    placeholder="Select Client"
                    labelHidden={true}
                    options={clientOptns}
                    name="clientId"
                  />
                  <ErrorField name="clientId" />
                </div>
              </div>
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}
