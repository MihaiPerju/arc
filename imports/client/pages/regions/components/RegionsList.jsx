import React, {Component} from 'react';
import RegionSingle from './RegionSingle';

export default class RegionsList extends Component {
    render() {
        return (
            <div className={this.props.class}>
                <RegionSingle renderContent={this.props.renderContent} showBtnGroup={this.props.showBtnGroup}/>
            </div>
        );
    }
}
