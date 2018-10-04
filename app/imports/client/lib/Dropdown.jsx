import React, {Component} from 'react';

export default class Dropdown extends Component {

    onFilterAssignee = (filter) => {
        const {getProperAccounts} = this.props;
        getProperAccounts(filter);
    };

    render() {
        const {options, assignFilterArr} = this.props;

        return (
            <div className="dropdown">
                <ul className="dropdown__wrapper">
                    {
                        options && options.map((option) => {
                            return(
                                <div key={option.filter} className="check-group">
                                    <input checked={assignFilterArr.includes(option.filter)} type="checkbox"/>
                                    <label onClick={this.onFilterAssignee.bind(this, option.filter)}>
                                        {option.label}
                                    </label>
                                </div>
                            )


                        })
                    }
                </ul>
            </div>
        )
    }
}