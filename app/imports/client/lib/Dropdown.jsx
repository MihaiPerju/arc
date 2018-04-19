import React, {Component} from 'react';

export default class Dropdown extends Component {

    onFilterAssignee = (filter) => {
        const {getProperAccounts, toggleDropdown} = this.props;
        getProperAccounts(filter);
        toggleDropdown();
    };

    render() {
        const {options} = this.props;

        return (
            <div className="dropdown">
                <ul className="dropdown__wrapper">
                    {
                        options && options.map((option) => {
                            return <li><a onClick={this.onFilterAssignee.bind(this, option.filter)}>{option.label}</a>
                            </li>
                        })
                    }
                </ul>
            </div>
        )
    }
}