import React from 'react';
import Notifier from '/imports/client/lib/Notifier';
import LetterTemplatePreview from './components/LetterTemplatePreview';
import GenerateLetterTemplateInputs from './components/GenerateLetterTemplateInputs';
import taskAttachmentsQuery from '/imports/api/tasks/queries/taskAttachmentsList';
import TaskViewService from '/imports/client/pages/tasks/services/TaskViewService';

class LetterEditContainer extends React.Component {
    constructor() {
        super();

        this.state = {
            letterTemplates: [],
            selectedTemplate: {},
            pdfAttachments: [],
            selectedAttachments: [],
            attachmentIds: []
        };
    }

    componentWillMount() {
        const {data, account} = this.props;
        this.setState({letterTemplates: data});
        const {profile} = Meteor.user();
        _.extend(account, profile);
        this.updateState(account);

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
        const {account, selectedTemplate, reset, selectedLetter} = this.props;
        const {keywords, body, _id: letterId} = selectedTemplate;
        const {letterTemplates, pdfAttachments, selectedAttachments, attachmentIds} = this.state;
        const model = {letterTemplate: null};
        const options = this.getSelectOptions(letterTemplates);
        const attachmentOptions = this.getAttachmentOptions(pdfAttachments);

        return (
            <div>
                <div className={JSON.stringify(selectedTemplate) !== "{}" && "letter-template"}>
                    <div className="left-col">
                        <GenerateLetterTemplateInputs
                            account={account}
                            templateKeywords={keywords}
                            onChange={this.updateState}/>
                    </div>
                    <div className="right-col">
                        <LetterTemplatePreview
                            reset={reset}
                            taskId={account._id}
                            letterTemplateBody={body}
                            letterTemplateId={letterId}
                            parentState={this.state}
                            attachments={attachmentIds}
                            currentComponent='edit'
                            selectedLetter={selectedLetter}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default LetterEditContainer;