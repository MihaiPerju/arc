import React, {Component} from 'react';
import classNames from 'classnames';

export default class PayItem extends Component {
    render() {
        const {active, insurance} = this.props;
        const classes = classNames({
            'pay-item': true,
            'pay-item active': active
        });

        return (
            <div className={classes}>
                <div className="brand-block">
                    <div className="text-light-grey text-center">{insurance.insName}</div>
                </div>
                <div className="pay-item__wrapper">
                    <div className="info-row">
                        <div className="text-light-grey">Balance</div>
                        <div className="text-dark-grey price">
                            {insurance.insBal ? insurance.insBal : 0}
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="text-light-grey">Phone number</div>
                        <div className="text-dark-grey">(214) 905-5487</div>
                    </div>
                    <div className="info-row">
                        <div className="text-light-grey">Last bill date</div>
                        <div className="text-dark-grey">
                            {insurance.billDate ? insurance.billDate : ""}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}