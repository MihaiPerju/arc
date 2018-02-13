import React, {Component} from 'react';
import SelectBlock from './ui/SelectBlock';

export default class FilterBar extends Component {
    render() {
        return (
            <div className="filter-bar">
                <SelectBlock header={'Select facility'}/>
                <SelectBlock header={'Select asignee'}/>
            </div>
        )
    }
}