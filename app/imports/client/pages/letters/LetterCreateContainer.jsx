import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import LetterTemplatePreview from "./components/LetterTemplatePreview";
import GenerateLetterTemplateInputs from "./components/GenerateLetterTemplateInputs";
import { variablesEnum } from "/imports/api/letterTemplates/enums/variablesEnum";
import Loading from "/imports/client/lib/ui/Loading";

class LetterCreateContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      letterTemplates: [],
      selectedTemplateId: null,
      pdfAttachments: [],
      selectedAttachments: [],
      keywordsValues: {},
      isCompleted: false,
      loading: false
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

  updateState = data => {
    const { selectedTemplate } = this.props;
    this.setState(data, () => {
      this.checkCompleteness();
    });
    this.getKeywordsValues(selectedTemplate);
  };

  componentWillReceiveProps = props => {
    const { selectedTemplate } = props;
    if (selectedTemplate._id != this.state.selectedTemplateId) {
      this.setState({ loading: true });
      this.getAttachments();
      this.getKeywordsValues(selectedTemplate);
      this.setState({ selectedTemplateId: selectedTemplate._id }, () => {
        this.setState({ loading: false });
      });
    }
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
    this.setState({ keywordsValues }, () => {
      this.setState({ loading: false });
    });
  };

  checkCompleteness = () => {
    const { keywordsValues } = this.state;
    for (let key in keywordsValues) {
      if (!this.state[key]) {
        this.setState({ isCompleted: false });
        return;
      }
    }
    this.setState({ isCompleted: true });
  };

  render() {
    const { account, selectedTemplate, reset } = this.props;
    const { keywords, body, _id: letterId, name } = selectedTemplate;
    const {
      pdfAttachments,
      selectedAttachments,
      keywordsValues,
      isCompleted,
      loading
    } = this.state;

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
              account={account}
              selectedAttachments={selectedAttachments}
              pdfAttachments={pdfAttachments}
              templateKeywords={keywords}
              keywordsValues={keywordsValues}
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
              isCompleted={isCompleted}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default LetterCreateContainer;
