import React, { Component } from "react";
import LetterTemplateSchema from "/imports/api/letterTemplates/schemas/schema";
import {
  AutoForm,
  AutoField,
  ErrorField,
  SelectField,
  LongTextField
} from "/imports/ui/forms";
import RichTextArea from "/imports/client/lib/uniforms/RichTextArea.jsx";
import Notifier from "/imports/client/lib/Notifier";
import { CategoryList } from "/imports/api/letterTemplates/enums/categories.js";

export default class CreateLetterTemplate extends Component {
  constructor() {
    super();
    this.state = {
      isDisabled: false
    };
  }

  onSubmit = data => {
    this.setState({ isDisabled: true });
    Meteor.call("letterTemplate.create", data, err => {
      if (!err) {
        Notifier.success("Letter template added!");
        this.onClose();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  };

  getCategories = categories => {
    return categories.map((category, key) => ({
      value: category,
      label: category
    }));
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
              Confirm & save {isDisabled && <i className="icon-cog" />}
            </button>
          </div>
        </div>
        <div className="create-form__wrapper">
          <div className="action-block i--block">
            <AutoForm
              schema={LetterTemplateSchema}
              onSubmit={this.onSubmit}
              ref="form"
            >
              <div className="form-wrapper">
                <AutoField
                  labelHidden={true}
                  type="text"
                  placeholder="Letter name"
                  name="name"
                />
                <ErrorField name="name" />
              </div>
              <div className="form-wrapper">
                <LongTextField
                  labelHidden={true}
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
                    labelHidden={true}
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
