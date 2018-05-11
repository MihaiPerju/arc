import React from 'react';
import Notifier from '/imports/client/lib/Notifier';
import {EJSON} from 'meteor/ejson'
import accountQuery from '/imports/api/accounts/queries/accountList';
import {Divider, Container, Header} from 'semantic-ui-react';
import AccountData from '/imports/client/pages/accounts/components/AccountData';

export default class ReportView extends React.Component {
    constructor() {
        super();
        this.state = {
            accounts: []
        };
    }

    componentWillMount() {
        const {id} = this.props;

        Meteor.call("report.getById", id, (err, report) => {
            if (!err) {
                const filters = EJSON.parse(report.mongoFilters);
                accountQuery.clone({filters}).fetch((err, accounts) => {
                    if (!err) {
                        this.setState({
                            accounts
                        })
                    } else {
                        Notifier.error(err.reason);
                    }
                })
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    render() {
        const {accounts} = this.state;
        return (
            <Container>
                {
                    accounts.map((account, index) => {
                        return <div>
                            <Header textAlign="center">Account No.{index + 1}</Header>
                            <AccountData account={account} key={index}/>
                            <Divider/>
                        </div>
                    })
                }
            </Container>
        )
    }
}