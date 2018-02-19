import React from 'react';
import LetterTemplatePreview from './components/LetterTemplatePreview';
import GenerateLetterTemplateInputs from './components/GenerateLetterTemplateInputs';

class LetterCreateContainer extends React.Component {
    constructor() {
        super();

        this.state = {
            letterTemplates: [],
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