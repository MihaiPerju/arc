import React from 'react';
import {AutoForm, ErrorField} from 'uniforms-semantic';
import {Container, Header, Divider, Grid} from 'semantic-ui-react';
import SelectWithDescription from '/imports/client/lib/uniforms/SelectWithDescription.jsx';
import letterCreateActionSchema from '/imports/client/pages/letters/schemas/letterCreateAction.js';
import Notifier from '/imports/client/lib/Notifier';
import LetterTemplatePreview from './components/LetterTemplatePreview';
import GenerateLetterTemplateInputs from './components/GenerateLetterTemplateInputs';

class LetterCreateContainer extends React.Component {
    constructor() {
        super();

        this.state = {
            letterTemplates: [],
            selectedTemplate: {},
        };
    }

    componentWillMount() {
        Meteor.call('manager.letterTemplates.get', (err, letterTemplates) => {
            if (err) {
                return Notifier.error(
                    'Error while trying to get letter templates');
            }
            this.setState({letterTemplates});
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

    onSubmit = (data) => {
        this.setState({selectedTemplate: data.letterTemplate.templateData});
    };

    updateState = (data) => {
        this.setState(data);
    };

    render() {
        const {taskId} = this.props;
        const {letterTemplates, selectedTemplate} = this.state;
        const {keywords, body} = selectedTemplate;
        const model = {letterTemplate: null};
        const options = this.getSelectOptions(letterTemplates);

        return (
            <Container className="page-container">
                <Header as="h3" textAlign="center">Letter creation</Header>
                <AutoForm autosave
                          schema={letterCreateActionSchema}
                          model={model}
                          onSubmit={this.onSubmit}>
                    <SelectWithDescription
                        placeholder={'Select one of the letter templates'}
                        name="letterTemplate" options={options}/>
                    <ErrorField name="letterTemplate"/>
                </AutoForm>

                <Divider/>
                <Grid divided='vertically'>
                    <Grid.Row columns={2}>
                        <Grid.Column width={6}>
                            <GenerateLetterTemplateInputs
                                templateKeywords={keywords}
                                onChange={this.updateState}/>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <LetterTemplatePreview
                                taskId={taskId}
                                letterTemplateBody={body}
                                parentState={this.state}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}

export default LetterCreateContainer;