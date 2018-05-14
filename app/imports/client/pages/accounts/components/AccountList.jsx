import React, {Component} from 'react';
import AccountSingle from './AccountSingle.jsx';
import _ from "underscore";

export default class AccountList extends Component {
    constructor(props) {
        super(props);
    }

    accountIsActive(account) {
        const {accountsSelected} = this.props;
        return _.includes(accountsSelected, account._id);
    }

    render() {
        const {data, checkAccount, selectAccount, currentAccount, classes} = this.props;

        return (
            <div className={classes}>
                {
                    data
                    &&
                    _.map(data, (account) => {
                        return <AccountSingle active={this.accountIsActive(account)}
                                              currentAccount={currentAccount}
                                              selectAccount={selectAccount}
                                              checkAccount={checkAccount}
                                              update={this.update}
                                              key={account._id}
                                              account={account}/>
                    })
                }
            </div>
        );
    }
}