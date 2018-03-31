import React, {Component} from 'react';

export default class Dropdown extends Component {
    render() {
        const {options} = this.props;

        return (
            <div className="dropdown">
                <ul className="dropdown__wrapper">
                    {
                        options && options.map((option) => {
                            return <li><a href="">{option}</a></li>
                        })
                    }
                </ul>
            </div>
        )
    }
}