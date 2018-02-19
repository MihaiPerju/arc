import React, {Component} from 'react';
import LetterTemplateHeader from './components/LetterTemplateContent/LetterTemplateHeader';
import LetterBody from './components/LetterTemplateContent/LetterBody';
import DescriptionBlock from './components/LetterTemplateContent/DescriptionBlock';

export default class LetterTemplateContent extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="main-content letter-temp-content">
                <LetterTemplateHeader/>
                <DescriptionBlock/>
                <LetterBody/>
            </div>
        )
    }
}