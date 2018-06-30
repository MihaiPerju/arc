import React, { Component } from "react";
import Loading from "/imports/client/lib/ui/Loading";
import { getImagePath } from "/imports/api/utils";
import { AutoForm, SelectField, ErrorField } from "uniforms-unstyled";
import SimpleSchema from "simpl-schema";
import LetterEditContainer from "/imports/client/pages/letters/LetterEditContainer.jsx";

export default class EditLetter extends Component {
  constructor() {
    super();
    this.state = {
      fade: false,
      selectedTemplate: {},
      model: {}
    };
  }

  componentDidMount() {
    const { selectedLetter } = this.props;
    this.getSelectedLetter(selectedLetter);
    setTimeout(() => {
      this.setState({ fade: true });
    }, 1);
  }

  componentWillReceiveProps(newProps) {
    const { selectedLetter } = newProps;
    this.getSelectedLetter(selectedLetter);
  }

  getSelectedLetter = selectedLetter => {
    let model = {};
    const selectedTemplate =
      this.getLetterTemplate(selectedLetter.letterTemplateId) || {};
    if (!_.isEmpty(selectedTemplate)) {
      model = {
        selectedOption: selectedTemplate._id
      };
    }
    this.setState({ model, selectedTemplate });
  };

  getOptions = data => {
    return _.map(data, letterTemplate => ({
      value: letterTemplate._id,
      label: letterTemplate.name
    }));
  };

  getLetterTemplate(value) {
    const { letterTemplates } = this.props;
    for (let letterTemplate of letterTemplates) {
      if (letterTemplate._id === value) {
        return letterTemplate;
      }
    }
  }

  onHandleChange(label, value) {
    const selectedTemplate = this.getLetterTemplate(value);
    this.setState({
      selectedTemplate
    });
  }

  cancel() {
    const { cancelEdit } = this.props;
    cancelEdit();
  }

  render() {
    const { letterTemplates, account, cancelEdit, selectedLetter } = this.props;
    const { selectedTemplate, model } = this.state;
    const { avatar, profile } = Meteor.user();
    const options = this.getOptions(letterTemplates);

    return (
      <div className={this.state.fade ? "new-letter in" : "new-letter"}>
        <div className="row-block">
          <div className="info">
            <img
              className="md-avatar img-circle"
              src={avatar ? getImagePath(avatar.path) : "/assets/img/user1.svg"}
              alt=""
            />
            <div className="name">
              {profile.firstName + " " + profile.lastName}
            </div>
          </div>
          <div className="form-group">
            <AutoForm
              model={model}
              onChange={this.onHandleChange.bind(this)}
              schema={schema}
            >
              <SelectField
                name="selectedOption"
                placeholder="Select letter"
                options={options}
              />
            </AutoForm>
            <button onClick={this.cancel.bind(this)} className="btn--red">
              Cancel
            </button>
          </div>
        </div>
        <LetterEditContainer
          selectedTemplate={selectedTemplate}
          account={account}
          reset={cancelEdit}
          data={letterTemplates}
          selectedLetter={selectedLetter}
        />
      </div>
    );
  }
}

const schema = new SimpleSchema({
  selectedOption: {
    type: String,
    label: false
  }
});
