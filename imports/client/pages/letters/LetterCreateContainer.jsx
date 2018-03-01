import React from 'react';
import { AutoForm, ErrorField } from 'uniforms-semantic';
import { Container, Header, Divider, Grid } from 'semantic-ui-react';
import SelectWithDescription from '/imports/client/lib/uniforms/SelectWithDescription.jsx';
import letterCreateActionSchema from '/imports/client/pages/letters/schemas/letterCreateAction.js';
import Notifier from '/imports/client/lib/Notifier';
import LetterTemplatePreview from './components/LetterTemplatePreview';
import GenerateLetterTemplateInputs from './components/GenerateLetterTemplateInputs';

class LetterCreateContainer extends React.Component {
    constructor () {
        super();

        this.state = {
            letterTemplates: [],
            selectedTemplate: {},
            pdfAttachments: [],
            selectedAttachments: [],
            attachmentIds: []
        };
    }

    componentWillMount () {
        const {data} = this.props;
        this.setState({letterTemplates: data});

        Meteor.call('letterTemplates.get', (err, letterTemplates) => {
            if (err) {
                return Notifier.error(
                    'Error while trying to get letter templates');
            }
            this.setState({letterTemplates});
        });

        taskAttachmentsQuery.clone({_id: this.props.taskId}).fetchOne((err, data) => {
            if (!err) {
                this.setState({
                    pdfAttachments: data.attachments
                });
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    getSelectOptions = (letterTemplates) => {
        let selectOptions = [];

        letterTemplates.forEach(template => {
            selectOptions.push({
                label: template.name,
                value: template.name,
                description: template.description,
                templateData: template,
            });
        });

        return selectOptions;
    };

    getAttachmentOptions = (enums) => {
        return _.map(enums, (value, key) => {
            return {value: value._id, label: TaskViewService.getPdfName(value)};
        });
    };

    onSubmit = (data) => {
        this.setState({
            selectedTemplate: data.letterTemplate.templateData,
            selectedAttachments: data.attachmentIds
        });
    };

    updateState = (data) => {
        this.setState(data);
    };

    render() {
        const {taskId, selectedTemplate, reset} = this.props;
        const {keywords, body} = selectedTemplate;
        const {letterTemplates, pdfAttachments, selectedAttachments, attachmentIds} = this.state;
        const model = {letterTemplate: null};
        const options = this.getSelectOptions(letterTemplates);
        const attachmentOptions = this.getAttachmentOptions(pdfAttachments);

        return (
            <div>
                <div className={JSON.stringify(selectedTemplate) !== "{}" && "letter-template"}>
                    <div className="left-col">
                        <GenerateLetterTemplateInputs
                            templateKeywords={keywords}
                            onChange={this.updateState}/>
                    </div>
                    <div className="right-col">
                        <LetterTemplatePreview
                            reset={reset}
                            taskId={taskId}
                            letterTemplateBody={body}
                            parentState={this.state}
                            attachments={attachmentIds}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default LetterCreateContainer;