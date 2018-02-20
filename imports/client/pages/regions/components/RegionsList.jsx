import React, {Component} from 'react';
import RegionSingle from './RegionSingle';

export default class RegionsList extends Component {
    render() {
        const {regions} = this.props;
        const regionList = regions.map(function (region, index) {
            const {setRegion, selectRegion, regionsSelected, currentRegion} = this.props;
            return (
                <RegionSingle
                    regionsSelected={regionsSelected}
                    currentRegion={currentRegion}
                    selectRegion={selectRegion}
                    setRegion={setRegion}
                    region={region}
                    key={index}
                />
            )
        }, this);

        return (
            <div className={this.props.class}>
                {regionList}
            </div>
        );
    }
}
