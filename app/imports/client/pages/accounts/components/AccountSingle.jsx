import React, {Component} from 'react';
import classNames from 'classnames';
import moment from "moment/moment";

export default class AccountSingle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontNormal: false,
            checked: false
        };
    }

    onCheck(e) {
        e.stopPropagation();
        const {checkAccount, account} = this.props;
        checkAccount(account);
    }

    onSelectAccount() {
        const {selectAccount, account} = this.props;
        selectAccount(account);
    }

    render() {
        const {account, active, currentAccount} = this.props;
        const classes = classNames({
            'list-item task-item': true,
            'open': account._id === currentAccount,
            'bg--yellow': active
        });

        console.log('account', account.acctBal, account.tickleDate, account.createdAt, account.dischrgDate, account.fbDate, account.admitDate)
        return (
            <div className={classes}
                 onClick={this.onSelectAccount.bind(this)}
            >
                <div className="check-item">
                    <input type="checkbox" checked={active} className="hidden"/>
                    <label onClick={this.onCheck.bind(this)}/>
                </div>
                <div className="mark-task">
                    <input type="checkbox" className="hidden"/>
                    <label></label>
                </div>
                <div className="row__item">
                    <div className="left__side">
                        <div
                            className={this.state.fontNormal ? 'person font-normal' : 'person'}>{account.ptName}</div>
                    </div>
                    <div className="right__side">
                        <div className="pacient-id text-blue">
                            {account.acctNum}
                        </div>
                        <div className="financial-class">O/D</div>
                        <div className="time">{account && moment(account.createdAt).format(' hh:mm')}</div>
                    </div>
                </div>
                <div className="row__item">
                    <div className="price">{account.acctBal}</div>
                    <div className="location">{account.facility && account.facility.name}</div>
                </div>
            </div>
        );
    }
}