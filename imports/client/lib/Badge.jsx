import React, {Component} from 'react';

export default class Badge extends Component {
    render() {
        const {num} = this.props;

        return (
            <div className="badge">{num}</div>
        )
    }
}