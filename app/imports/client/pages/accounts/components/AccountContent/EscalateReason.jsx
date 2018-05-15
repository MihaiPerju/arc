import React, {Component} from 'react';

export default class EscalateReason extends Component {
    render() {
        const {reason} = this.props;

        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">escalate reason</div>
                </div>
                <div className="main__block">
                    <div className="description-block">
                        <p className="text-light-grey">{reason}</p>
                    </div>
                </div>
            </div>

        )
    }
}