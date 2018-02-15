import React, {Component} from 'react';
import {SelectField} from '/imports/ui/forms';

export default class FilterBar extends Component {
    render() {
        const {options} = this.props;
        const [facilities, assignees] = options;
        return (
            <div className="filter-bar">
                <ul className="select-wrapper">
                    <SelectField name="facilityId" options={facilities}/>
                    <SelectField name="assigneeId" options={assignees}/>
                </ul>
            </div>
        )
    }
}