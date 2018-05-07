import React from 'react';
import Parser from 'simple-text-parser';
import CreateLetter from './CreateLetter';
import {Divider} from 'semantic-ui-react';
import {variablesEnum} from '/imports/api/letterTemplates/enums/variablesEnum';

export default class LetterTemplatePreview extends React.Component {
    tagParser = () => {
        const {parentState} = this.props;
        const parser = new Parser();
        const {letterTemplateBody} = this.props;
        if (!letterTemplateBody) {
            return;
        }

        parser.addRule(/{(.*?)}/g, function (tag) {
            const word = tag.substring(1).slice(0, -1);
            if (variablesEnum[word]) {
                return `${parentState[variablesEnum[word].field] ? parentState[variablesEnum[word].field] : `{${word}}`}`;
            } else {
                return `${parentState[word] ? parentState[word] : `{${word}}`}`;
            }
        });

        return parser.render(letterTemplateBody);
    };

    render() {
        const {letterTemplateBody, taskId, reset, attachments, letterTemplateId} = this.props;
        const letterBody = this.tagParser();

        return (
            <div>
                {!!letterTemplateBody && <div dangerouslySetInnerHTML={{__html: letterBody}}/>}
                {letterTemplateBody &&
                <div>
                    <Divider/>
                    <CreateLetter letterTemplateId={letterTemplateId} reset={reset} taskId={taskId} letterBody={letterBody} attachments={attachments}/>
                </div>
                }
            </div>
        );
    }
}