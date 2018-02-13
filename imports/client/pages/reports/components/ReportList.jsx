import React, {Component} from 'react';
import ReportSingle from './ReportSingle';

export default class ReportList extends Component {
    render() {
        return (
            <div className={this.props.class}>
                <ReportSingle renderContent={this.props.renderContent} showBtnGroup={this.props.showBtnGroup}/>
            </div>
        );
    }
}
