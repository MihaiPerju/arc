import React, {Component} from 'react';
import LetterTemplateSingle from './LetterTemplateSingle';

export default class LetterTemplatesList extends Component {
    render() {
    	const letters = [
    	    { title: 'Contact letter with offers' },
    	    { title: 'Holiday letter' },
    	    { title: 'Weekly announcement' },
    	    { title: 'Welcome letter' }
    	];
    	const letterList = letters.map(function(letter, index){
    		const { renderContent, showBtnGroup } = this.props;
    	    return (
    	        <LetterTemplateSingle
    	        	key={index}
    	        	id={index}
    	        	title={letter.title}
	    	        renderContent={renderContent}
	    	        showBtnGroup={showBtnGroup}
    	    	/>
    	    )
    	}, this);

        return (
            <div className={this.props.class}>
                { letterList }
            </div>
        );
    }
}
