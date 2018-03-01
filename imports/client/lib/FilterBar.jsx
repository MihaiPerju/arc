import React, {Component} from 'react';
import {SelectField} from '/imports/ui/forms';

export default class FilterBar extends Component {
    render() {
        const {options} = this.props;

        return (
            <div className="filter-bar">
                <div className="select-wrapper">
                    <div className="select-form">
                        <SelectField name="facilityId" options={options && options.facilities}/>
                    </div>
                    <div className="select-form">
                        <SelectField name="assigneeId" options={options && options.assignees}/>
                    </div>
                </div>
            </div>
        )
    }
}