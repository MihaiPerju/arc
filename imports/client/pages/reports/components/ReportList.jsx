import React, {Component} from 'react';
import ReportSingle from './ReportSingle';

export default class ReportList extends Component {
    render() {
    	const reports = [
			{ title: 'Needs a new upgrade, Report nr' },
			{ title: 'Report nr' },
			{ title: 'Unknown cliend, needs to be checked' },
    	];
    	const reportList = reports.map(function(report, index){
    		const { renderContent, showBtnGroup } = this.props;
    		return (
				<ReportSingle
					key={index}
					id={index}
					title={report.title}
					renderContent={renderContent}
					showBtnGroup={showBtnGroup}
				/>
    		)
    	}, this);
    	
        return (
            <div className={this.props.class}>
                { reportList }
            </div>
        );
    }
}
