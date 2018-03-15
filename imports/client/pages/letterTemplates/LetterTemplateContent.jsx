import React, {Component} from 'react';
import LetterTemplateHeader from './components/LetterTemplateContent/LetterTemplateHeader';
import LetterBody from './components/LetterTemplateContent/LetterBody';
import DescriptionBlock from './components/LetterTemplateContent/DescriptionBlock';
import LetterTemplateEdit from './LetterTemplateEdit.jsx'

export default class LetterTemplateContent extends Component {
    constructor() {
        super();
        this.state = {
            edit: false
        }
    }

    componentWillReceiveProps() {
        this.setState({edit: false});
    }

    setEdit = () => {
        const {edit} = this.state;
        this.setState({edit: !edit})
    };

    render() {
        const {template} = this.props;
        const {edit} = this.state;
        return (
            <div>
                { edit ? <LetterTemplateEdit template={template} close={this.setEdit}/> :
                    <div className="main-content letter-temp-content">
                        <LetterTemplateHeader onEdit={this.setEdit} template={template}/>
                        <DescriptionBlock template={template}/>
                        <LetterBody template={template}/>
                    </div>
                }
            </div>

        )
    }
}