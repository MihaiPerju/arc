import React, {Component} from 'react';
import {SelectField} from '/imports/ui/forms';

export default class FilterBar extends Component {
    render() {
        const {options} = this.props;
        
        return (
            <div className="filter-bar">
                <div className="select-wrapper">
                    <div className="select-form">
                        <SelectField
                            labelHidden={true}
                            name="facilityId"
                            options={options}
                        />
                    </div>
                    <div className="select-form">
                        <SelectField
                            labelHidden={true}
                            name="assigneeId"
                            options={options}
                        />
                    </div>
                </div>
            </div>
        )
    }
}