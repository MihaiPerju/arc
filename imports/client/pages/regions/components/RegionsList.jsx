import React, {Component} from 'react';
import RegionSingle from './RegionSingle';

export default class RegionsList extends Component {
    render() {
        const {regions,setRegion, selectRegion, regionsSelected, currentRegion} = this.props;
        const regionList = regions.map(function (region, index) {
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
