import React, {Component} from 'react';
import FacilitySingle from './FacilitySingle';

export default class Facility extends Component {
    render() {
        const {facilities, currentFacility, selectFacility, setFacility, facilitiesSelected} = this.props;
        return (
            <div className={this.props.class}>
                {
                    facilities.map(function (facility, index) {
                        return (
                            <FacilitySingle
                                facilitiesSelected={facilitiesSelected}
                                currentFacility={currentFacility}
                                selectFacility={selectFacility}
                                setFacility={setFacility}
                                facility={facility}
                                key={index}
                            />
                        )
                    })
                }
            </div>
        )
    }
}