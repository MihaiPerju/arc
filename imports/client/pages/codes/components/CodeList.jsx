import React, {Component} from 'react';
import CodeSingle from './CodeSingle';

export default class ReportList extends Component {
    render() {
        return (
            <div className={this.props.class}>
                <CodeSingle renderContent={this.props.renderContent} showBtnGroup={this.props.showBtnGroup}/>
            </div>
        );
    }
}
