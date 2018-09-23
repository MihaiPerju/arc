import React, {Component} from 'react';
import Loading from '/imports/client/lib/ui/Loading';
import {getImagePath} from '/imports/api/utils';
import {AutoForm, SelectField, ErrorField} from 'uniforms-unstyled';
import SimpleSchema from 'simpl-schema';
import LetterCreateContainer
  from '/imports/client/pages/letters/LetterCreateContainer.jsx';

export default class NewLetter extends Component {
  constructor () {
    super ();
    this.state = {
      fade: false,
      selectedTemplate: {},
    };
  }

  componentDidMount () {
    setTimeout (() => {
      this.setState ({fade: true});
    }, 1);
  }

  getOptions = data => {
    return _.map (data, letterTemplate => ({
      value: letterTemplate._id,
      label: letterTemplate.name,
    }));
  };

  getLetterTemplate (value) {
    const {letterTemplates} = this.props;
    for (let letterTemplate of letterTemplates) {
      if (letterTemplate._id === value) {
        return letterTemplate;
      }
    }
  }

  onHandleChange (label, value) {
    const selectedTemplate = this.getLetterTemplate (value);
    this.setState ({
      selectedTemplate,
    });
  }

  cancel () {
    const {cancel} = this.props;
    cancel ();
  }

  render () {
    const {letterTemplates, account, cancel} = this.props;
    const {selectedTemplate} = this.state;
    const {avatar, profile} = Meteor.user ();
    const options = this.getOptions (letterTemplates);
    
    return (
      <div className={this.state.fade ? 'new-letter in' : 'new-letter'}>
        <div className="row-block">
          <div className="info">
            <img
              className="md-avatar img-circle"
              src={
                avatar ? getImagePath (avatar.path) : '/assets/img/user1.svg'
              }
              alt=""
            />
            <div className="name truncate">
              {profile.firstName + ' ' + profile.lastName}
            </div>
          </div>
          <div className="action-form">
            <AutoForm
              onChange={this.onHandleChange.bind (this)}
              schema={schema}
            >
              <div className="select-row">
                <div className="select-group">
                  <SelectField
                    className="select-width"
                    name="selectedOption"
                    placeholder="Select letter"
                    options={options}
                  />
                </div>
              </div>
              <div className="btn-group">
                <button onClick={this.cancel.bind (this)} className="btn--red">
                  Cancel
                </button>
              </div>
            </AutoForm>
          </div>
        </div>
        {!_.isEmpty (selectedTemplate) &&
          <LetterCreateContainer
            selectedTemplate={selectedTemplate}
            account={account}
            reset={cancel}
            data={letterTemplates}
          />}
      </div>
    );
  }
}

const schema = new SimpleSchema ({
  selectedOption: {
    type: String,
    label: false,
  },
});
