import React, {Component} from 'react';
import RegionSingle from './RegionSingle';

export default class RegionsList extends Component {
    render() {
    	const regions = [
            { name: 'Romania' },
            { name: 'Italy' },
            { name: 'Germany' },
            { name: 'Spain' }
        ];

		const regionList = regions.map(function(region, index){
        	const { renderContent, showBtnGroup } = this.props;
			return (
                <RegionSingle
                	key={index}
                	id={index}
                	renderContent={renderContent}
                	showBtnGroup={showBtnGroup}
                	name={region.name}
                />
			)
		}, this);

        return (
            <div className={this.props.class}>
            	{ regionList }
            </div>
        );
    }
}
