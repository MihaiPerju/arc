import React from "react";
import { Link } from 'react-router-dom';

export default class MenuItem extends React.PureComponent {
    render() {
        return (
            <li className={this.props.className}>
                <Link to={this.props.route}>
                    <div className="menu__icon">
                        <i className={`icon-${this.props.icon}`} />
                    </div>
                    <span className="menu__label">
                        {this.props.label}
                    </span>
                </Link>
            </li>
        );
    }
}