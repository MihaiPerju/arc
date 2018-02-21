import React, {Component} from 'react';
import LetterTemplateSingle from './LetterTemplateSingle';

export default class LetterTemplatesList extends Component {
    render() {
        const {templates} = this.props;
        const letterList = templates.map(function (template, index) {
            const {setTemplate, selectTemplate, templatesSelected, currentTemplate} = this.props;            return (
                <LetterTemplateSingle
                    templatesSelected={templatesSelected}
                    currentTemplate={currentTemplate}
                    selectTemplate={selectTemplate}
                    setTemplate={setTemplate}
                    template={template}
                    key={index}
                />
            )
        }, this);

        return (
            <div className={this.props.class}>
                {letterList}
            </div>
        );
    }
}
