import React from 'react';
import LetterTemplatePreview from './components/LetterTemplatePreview';
import GenerateLetterTemplateInputs from './components/GenerateLetterTemplateInputs';

class LetterCreateContainer extends React.Component {
    constructor () {
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
        const {taskId, selectedTemplate, reset} = this.props;
        const {keywords, body} = selectedTemplate;

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
                            parentState={this.state}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default LetterCreateContainer;