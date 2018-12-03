import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import LetterTemplatePreview from "./components/LetterTemplatePreview";
import GenerateLetterTemplateInputs from "./components/GenerateLetterTemplateInputs";
import { variablesEnum } from "/imports/api/letterTemplates/enums/variablesEnum";
import Loading from "/imports/client/lib/ui/Loading";

class LetterEditContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      letterTemplates: [],
      selectedTemplate: {},
      pdfAttachments: [],
      selectedAttachments: [],
      keywordsValues: {}
    };
  }

  componentWillMount() {
    const { data, account, selectedLetter } = this.props;
    this.setState({ letterTemplates: data });
    const { profile } = Meteor.user();
    _.extend(account, profile);

    const clonedAccount = _.clone(account);
    const { letterValues, attachmentIds } = selectedLetter;
    Object.assign(clonedAccount, letterValues);
    Object.assign(clonedAccount, { selectedAttachmentIds: attachmentIds });
    this.updateState(clonedAccount);

    Meteor.call("letterTemplates.get", (err, letterTemplates) => {
      if (err) {
        return Notifier.error("Error while trying to get letter templates");
      }
      this.setState({ letterTemplates, loading: false });
    });

    this.getAttachments();
  }

  componentWillReceiveProps = newProps => {
    const { selectedTemplate } = newProps;
    this.getAttachments();
    this.getKeywordsValues(selectedTemplate);
  };

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

  updateState = data => {
    const { selectedTemplate } = this.props;
    this.setState(data);
    this.getKeywordsValues(selectedTemplate);
  };

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

  getAttachments() {
    const { account } = this.props;
    let pdfAttachments = [];
    if (account.attachments) {
      pdfAttachments = [...account.attachments];
    }
    this.setState({
      pdfAttachments
    });
  }

  render() {
    const { account, selectedTemplate, reset, selectedLetter } = this.props;
    const { keywords, body, _id: letterId } = selectedTemplate;
    const {
      pdfAttachments,
      selectedAttachments,
      keywordsValues,
      loading
    } = this.state;

    const clonedAccount = _.clone(account);
    const { letterValues, attachmentIds } = selectedLetter;
    Object.assign(clonedAccount, letterValues);
    Object.assign(clonedAccount, { selectedAttachmentIds: attachmentIds });
    if (loading) {
      return <Loading />;
    }

    return (
      <div>
        <div
          className={
            JSON.stringify(selectedTemplate) !== "{}" && "letter-template"
          }
        >
          <div className="left-col">
            <GenerateLetterTemplateInputs
              account={clonedAccount}
              templateKeywords={keywords}
              onChange={this.updateState}
              selectedAttachments={selectedAttachments}
              pdfAttachments={pdfAttachments}
            />
          </div>
          <div className="right-col">
            <LetterTemplatePreview
              reset={reset}
              taskId={account._id}
              letterTemplateBody={body}
              letterTemplateId={letterId}
              parentState={this.state}
              selectedAttachments={selectedAttachments}
              currentComponent="edit"
              selectedLetter={selectedLetter}
              keywordsValues={keywordsValues}
              keywords={keywords}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default LetterEditContainer;
