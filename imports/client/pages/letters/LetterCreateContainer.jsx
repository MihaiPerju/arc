import React from 'react';
import { AutoForm, ErrorField } from 'uniforms-semantic';
import { Container, Header, Divider, Grid } from 'semantic-ui-react';
import SelectWithDescription from '/imports/client/lib/uniforms/SelectWithDescription.jsx';
import letterCreateActionSchema from '/imports/client/pages/letters/schemas/letterCreateAction.js';
import Notifier from '/imports/client/lib/Notifier';
import LetterTemplatePreview from './components/LetterTemplatePreview';
import GenerateLetterTemplateInputs from './components/GenerateLetterTemplateInputs';
import taskAttachmentsQuery from '/imports/api/tasks/queries/taskAttachmentsList';
import SelectMulti from '/imports/client/lib/uniforms/SelectMulti.jsx';
import TaskViewService from '/imports/client/pages/tasks/services/TaskViewService';

class LetterCreateContainer extends React.Component {
    constructor () {
        super();

        this.state = {
            letterTemplates: [],
            selectedTemplate: {},
            pdfAttachments: [],
            selectedAttachments: []
        };
    }

    componentWillMount() {
        const {data} = this.props;
        this.setState({letterTemplates: data});
    }

    updateState = (data) => {
        this.setState(data);
    };


    render() {
        const {taskId, selectedTemplate} = this.props;
        console.log(selectedTemplate);
        const {keywords, body} = selectedTemplate;
        // const model = {letterTemplate: null};

        return (
            <div className="letter-template">
                <div className="left-col">
                    <GenerateLetterTemplateInputs
                        templateKeywords={keywords}
                        onChange={this.updateState}/>
                </div>
                <div className="right-col">
                    <LetterTemplatePreview
                        taskId={taskId}
                        letterTemplateBody={body}
                        parentState={this.state}/>
                </div>
            </div>
        );
    }
}

export default LetterCreateContainer;