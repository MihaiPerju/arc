import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import LetterTemplatePreview from "./components/LetterTemplatePreview";
import GenerateLetterTemplateInputs from "./components/GenerateLetterTemplateInputs";
import { variablesEnum } from "/imports/api/letterTemplates/enums/variablesEnum";

class LetterCreateContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      letterTemplates: [],
      selectedTemplate: {},
      pdfAttachments: [],
      selectedAttachments: [],
      keywordsValues: {}
    };
  }

  componentWillMount() {
    const { data, account, selectedTemplate } = this.props;
    this.setState({ letterTemplates: data });
    const { profile } = Meteor.user();
    _.extend(account, profile);
    this.updateState(account);

    Meteor.call("letterTemplates.get", (err, letterTemplates) => {
      if (err) {
        return Notifier.error("Error while trying to get letter templates");
      }
      this.setState({ letterTemplates });
    });
    this.getAttachments();
    this.getKeywordsValues(selectedTemplate);
  }

  getSelectOptions = letterTemplates => {
    let selectOptions = [];

    letterTemplates.forEach(template => {
      selectOptions.push({
        label: template.name,
        value: template.name,
        description: template.description,
        templateData: template
      });
    });

    return selectOptions;
  };

  onSubmit = data => {
    this.setState({
      selectedTemplate: data.letterTemplate.templateData,
      selectedAttachments: data.attachmentIds
    });
  };

  updateState = data => {
    const { selectedTemplate } = this.props;
    this.setState(data);
    this.getKeywordsValues(selectedTemplate);
  };

  componentWillReceiveProps = props => {
    const { selectedTemplate } = props;
    this.getAttachments();
    this.getKeywordsValues(selectedTemplate);
  };

  getAttachments() {
    const { account } = this.props;
    let pdfAttachments = [];
    if (account.attachments) {
      pdfAttachments = [...account.attachments];
    }
    this.setState({
      pdfAttachments,
      selectedAttachments: []
    });
  }

  getKeywordsValues = (selectedTemplate = {}) => {
    const { keywords } = selectedTemplate;
    const keywordsValues = {};
    _.each(keywords, value => {
      if (variablesEnum[value]) {
        keywordsValues[variablesEnum[value].field] = this.state[
          variablesEnum[value].field
        ];
      } else {
        keywordsValues[value] = this.state[value];
      }
    });
    this.setState({ keywordsValues });
  };

  render() {
    const { account, selectedTemplate, reset } = this.props;
    const { keywords, body, _id: letterId, name } = selectedTemplate;
    const {
      letterTemplates,
      pdfAttachments,
      selectedAttachments,
      keywordsValues
    } = this.state;
    const model = { letterTemplate: null };
    const options = this.getSelectOptions(letterTemplates);

    return (
      <div>
        <div
          className={
            JSON.stringify(selectedTemplate) !== "{}" && "letter-template"
          }
        >
          <div className="left-col">
            <GenerateLetterTemplateInputs
              account={account}
              selectedAttachments={selectedAttachments}
              pdfAttachments={pdfAttachments}
              templateKeywords={keywords}
              onChange={this.updateState}
            />
          </div>
          <div className="right-col">
            <LetterTemplatePreview
              reset={reset}
              accountId={account._id}
              letterTemplateBody={body}
              letterTemplateId={letterId}
              letterTemplateName={name}
              parentState={this.state}
              selectedAttachments={selectedAttachments}
              currentComponent="create"
              keywordsValues={keywordsValues}
              keywords={keywords}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default LetterCreateContainer;
