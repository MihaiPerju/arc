import React from 'react';
import Loading from '/imports/client/lib/ui/Loading.jsx';
import query from '/imports/api/accounts/queries/accountList';
import AccountDetails from './AccountDetails.jsx';
import DropzoneComponent from 'react-dropzone-component';
import { Divider } from 'semantic-ui-react';
import CommentsListContainer from '/imports/client/pages/comments/CommentsListContainer';
import { getToken } from '/imports/api/s3-uploads/utils';
import SelectActionsContainer from './SelectActionsContainer';
import { AutoForm } from 'uniforms-semantic';
import { Button } from 'semantic-ui-react';
import { Container } from 'semantic-ui-react';
import { Header } from 'semantic-ui-react';
import Notifier from '/imports/client/lib/Notifier';
import SimpleSchema from 'simpl-schema';

const ActionSchema = new SimpleSchema({
    action: {
        type: String,
        optional: true
    },
    reasonCode: {
        type: String,
        optional: true
    }
});

export default class AccountView extends React.Component {
    constructor () {
        super();

        this.state = {
            account: null,
            loading: true,
            actionId: false
        };
    }

    componentWillMount () {
        this.getAccount();
    }

    getAccount= () => {
        const {accountId} = this.props;
        query.clone({filters: {_id: accountId}}).fetchOne((err, account) => {
            if (err) {
                return Notifier.error('Error while getting account!');
            }

            this.setState({
                account,
                accountId: account._id,
                loading: false
            });
        });
    };

    onSubmit = (data) => {
        const {accountId} = this.props;
        data.accountId = accountId;
        Meteor.call('account.actions.add', data
            , (err) => {
                if (!err) {
                    Notifier.success('Data saved');
                    this.getAccount();
                    //Clear inputs
                    this.setState({
                        actionId:false
                    });
                    this.refs.form.reset();
                } else {
                    Notifier.error(err.reason);
                }
            });
    };

    onHandleChange = (field, value) => {
        if (field == 'action') {
            const actionId = value.value;
            this.setState({
                actionId
            });
        }
    };

    render () {
        const {loading, account, actionId} = this.state;
        const {accountId} = this.props;
        const componentConfig = {
            postUrl: `/uploads/account-pdf/` + accountId + '/' + getToken()
        };
        const that = this;
        const djsConfig = {
            complete (file) {
                Notifier.success('Added');
                this.removeFile(file);
                that.getAccount();
            },
            acceptedFiles: '.pdf'
        };

        if (loading) {
            return <Loading/>;
        } else return (
            <Container>
                <AccountDetails updateAccount={this.getAccount} account={account}/>
                <DropzoneComponent config={componentConfig} djsConfig={djsConfig}/>
                <Container className="page-container">
                    <Header as="h2" textAlign="center">Add Action</Header>
                    <AutoForm schema={ActionSchema} onSubmit={this.onSubmit} onChange={this.onHandleChange} ref="form">
                        <SelectActionsContainer actionId={actionId}/>
                        <Divider/>

                        <Button primary fluid type="submit">
                            Save
                        </Button>
                    </AutoForm>
                    <Divider/>
                    <CommentsListContainer accountId={account && account._id}/>
                </Container>
            </Container>
        );
    }
}
