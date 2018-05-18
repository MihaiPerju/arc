import React from "react";
import Parser from "simple-text-parser";
import CreateLetter from "./CreateLetter";
import LetterEdit from "./LetterEdit";
import { Divider } from "semantic-ui-react";
import { variablesEnum } from "/imports/api/letterTemplates/enums/variablesEnum";

export default class LetterTemplatePreview extends React.Component {
  tagParser = () => {
    const { parentState } = this.props;
    const parser = new Parser();
    const { letterTemplateBody } = this.props;
    console.log(letterTemplateBody);
    if (!letterTemplateBody) {
      return;
    }

    parser.addRule(/{(.*?)}/g, function(tag) {
      const word = tag.substring(1).slice(0, -1);
      if (variablesEnum[word]) {
        return `${
          parentState[variablesEnum[word].field]
            ? parentState[variablesEnum[word].field]
            : `{${word}}`
        }`;
      } else {
        return `${parentState[word] ? parentState[word] : `{${word}}`}`;
      }
    });

    return parser.render(letterTemplateBody);
  };

  render() {
    const {
      letterTemplateBody,
      accountId,
      reset,
      selectedAttachments,
      letterTemplateId,
      currentComponent,
      selectedLetter,
      keywordsValues,
      keywords,
      parentState
    } = this.props;
    const letterBody = this.tagParser();
    // console.log(letterTemplateBody);
    console.log(parentState);

    return (
      <div>
        {!!letterTemplateBody && (
          <div dangerouslySetInnerHTML={{ __html: letterBody }} />
        )}
        {letterTemplateBody && (
          <div>
            <Divider />
            {currentComponent === "create" ? (
              <CreateLetter
                letterTemplateId={letterTemplateId}
                reset={reset}
                accountId={accountId}
                letterBody={letterBody}
                selectedAttachments={selectedAttachments}
                keywordsValues={keywordsValues}
                hasKeywords={!!keywords.length}
              />
            ) : (
              <LetterEdit
                letterTemplateId={letterTemplateId}
                reset={reset}
                accountId={accountId}
                letterBody={letterBody}
                attachments={attachments}
                selectedLetterId={selectedLetter._id}
                keywordsValues={keywordsValues}
                hasKeywords={!!keywords.length}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}
