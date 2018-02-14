import React, {Component} from 'react';
import LetterTemplateSingle from './LetterTemplateSingle';

export default class LetterTemplatesList extends Component {
    render() {
        return (
            <div className={this.props.class}>
                <LetterTemplateSingle renderContent={this.props.renderContent} showBtnGroup={this.props.showBtnGroup}/>
            </div>
        );
    }
}
