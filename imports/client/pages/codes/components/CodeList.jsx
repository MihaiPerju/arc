import React, {Component} from 'react';
import CodeSingle from './CodeSingle';

export default class CodeList extends Component {
    render() {
    	const codes = [
            { name: 'Code1' },
            { name: 'Code2' },
            { name: 'Code3' }
        ];
        const codeList = codes.map(function(code, index){
        	const { renderContent, showBtnGroup } = this.props;
        	return (
				<CodeSingle
					key={index}
					id={index}
					renderContent={renderContent}
					showBtnGroup={showBtnGroup}
					name={code.name}
				/>
        	)
        }, this)
        return (
            <div className={this.props.class}>
                { codeList }
            </div>
        );
    }
}
