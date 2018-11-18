import React from "react";
import CreateLetter from "./CreateLetter";
import LetterEdit from "./LetterEdit";
import { Divider } from "semantic-ui-react";
import { variablesEnum } from "/imports/api/letterTemplates/enums/variablesEnum";

export default class LetterTemplatePreview extends React.Component {
  renderText = () => {
    const { parentState } = this.props;
    let { letterTemplateBody } = this.props;
    if (!letterTemplateBody) {
      return;
    }

    let result = letterTemplateBody;
    let regx = /\{([^}]+)\}/g;
    let m;

    do {
      m = regx.exec(letterTemplateBody);
      if (m) {
        let word = "{" + m[1] + "}";

        let wordToReplace = word;
        if (variablesEnum[m[1]] && parentState[variablesEnum[m[1]].field]) {
          wordToReplace = parentState[variablesEnum[m[1]].field];
        }
        result = result.replace(word, wordToReplace);
      }
    } while (m);
    return result;
  };

  render() {
    const {
      letterTemplateBody,
      accountId,
      reset,
      selectedAttachments,
      letterTemplateId,
      letterTemplateName,
      currentComponent,
      selectedLetter,
      keywordsValues,
      keywords
    } = this.props;
    const letterBody = this.renderText();

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
                letterTemplateName={letterTemplateName}
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
                letterTemplateName={letterTemplateName}
                reset={reset}
                accountId={accountId}
                letterBody={letterBody}
                selectedAttachments={selectedAttachments}
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
