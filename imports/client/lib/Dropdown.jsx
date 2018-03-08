import React, {Component} from 'react';

export default class Dropdown extends Component {
    render() {
        return (
            <div className="dropdown">
                <ul className="dropdown__wrapper">
                    <li><a href="">All</a></li>
                    <li><a href="">None</a></li>
                    <li><a href="">Read</a></li>
                    <li><a href="">Unread</a></li>
                </ul>
            </div>
        )
    }
}