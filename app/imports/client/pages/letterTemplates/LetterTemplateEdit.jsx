import React from "react";
import LetterTemplateSchema from "/imports/api/letterTemplates/schemas/schema";
import Notifier from "/imports/client/lib/Notifier";
import {
  AutoForm,
  AutoField,
  ErrorField,
  SelectField,
  LongTextField
} from "/imports/ui/forms";
import RichTextArea from "/imports/client/lib/uniforms/RichTextArea.jsx";
import { CategoryList } from "/imports/api/letterTemplates/enums/categories.js";

export default class EditLetterTemplate extends React.Component {
  constructor() {
    super();

    this.state = {
      error: null,
      isDisabled: false
    };
  }

  getCategories = categories => {
    return categories.map((category, key) => ({
      value: category,
      label: category
    }));
  };

  onSubmit = data => {
    this.setState({ isDisabled: true });
    Meteor.call("letterTemplate.update", data, err => {
      if (!err) {
        Notifier.success("Letter template updated");
        this.onClose();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  };

  onCreate = () => {
    const { form } = this.refs;
    form.submit();
  };

  onClose = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { model } = this.props;
    const { isDisabled } = this.state;
    const categories = this.getCategories(CategoryList);

    return (
      <div className="create-form letter-template-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onClose} className="btn-cancel">
              Cancel
            </button>
            <button
              style={isDisabled ? { cursor: "not-allowed" } : {}}
              disabled={isDisabled}
              onClick={this.onCreate}
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
          <div className="action-block i--block">
            <AutoForm
              model={model}
              schema={LetterTemplateSchema}
              onSubmit={this.onSubmit}
              ref="form"
            >
              <div className="form-wrapper">
                <AutoField
                  labelhidden={true}
                  type="text"
                  placeholder="Letter name"
                  name="name"
                />
                <ErrorField name="name" />
              </div>
              <div className="form-wrapper">
                <LongTextField
                  labelhidden={true}
                  placeholder="Description"
                  name="description"
                />
              </div>
              <div className="form-wrapper rich-text-area">
                <RichTextArea name="body" />
                <ErrorField name="body" />
              </div>
              <div className="select-group">
                <div className="form-wrapper">
                  <SelectField
                    labelhidden={true}
                    name="category"
                    placeholder="Category"
                    options={categories}
                  />
                  <ErrorField name="category" />
                </div>
              </div>
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}
