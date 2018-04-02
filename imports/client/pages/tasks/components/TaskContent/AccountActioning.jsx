import React from "react";
import Dialog from "/imports/client/lib/ui/Dialog";
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';
import WorkQueueService from './../../services/WorkQueueService';
import workQueueQuery from "/imports/api/tags/queries/listTags";
import AccountMetaData from "./AccountMetaData";
import AccountTickle from "./AccountTickle";
import AccountEscalation from "./AccountEscalation";

export default class AccountActioning extends React.Component {
    constructor() {
        super();
        this.state = {
            dialogIsActive: false,
            assignToUser: true,
            assignToWorkQueue: false,
            workQueueOptions: []
        }
    }

    componentWillMount() {
        workQueueQuery.clone().fetch((err, res) => {
            if (!err) {
                const workQueueOptions = WorkQueueService.createOptions(res);
                this.setState({workQueueOptions});
            }
        })
    }

    showQueueForm = () => {
        this.setState({
            assignToUser: false,
            assignToWorkQueue: true
        })
    };

    showUserForm = () => {
        this.setState({
            assignToUser: true,
            assignToWorkQueue: false
        })
    };

    openDialog = () => {
        this.setState({
            dialogIsActive: true
        });
    };


    closeDialog = () => {
        this.setState({
            dialogIsActive: false
        })
    };

    assignToUser = ({assigneeId}) => {
        const {accountId} = this.props;
        let accountIds = [];
        accountIds.push(accountId);
        Meteor.call('account.assignUser.bulk', {accountIds, assigneeId}, (err) => {
            if (!err) {
                Notifier.success('Account assigned to user!');
                this.closeDialog();
            } else {
                Notifier.error(err.reason);
            }
        })
    };

    assignToWorkQueue = ({workQueue}) => {
        const {accountId} = this.props;
        let accountIds = [];
        accountIds.push(accountId);
        Meteor.call("account.assignWorkQueue", {_id: accountId, workQueue}, (err) => {
            if (!err) {
                Notifier.success('Account assigned to Work Queue!');
                this.closeDialog();
            } else {
                Notifier.error(err.reason);
            }
        })
    };

    showDialog = () => {
        const {model, accountId, options, title, escalate, metaData, metaDataGroups, tickle} = this.props;
        const {workQueueOptions, assignToUser, assignToWorkQueue} = this.state;

        if (tickle) {
            return (
                <AccountTickle accountId={accountId} close={this.closeDialog}/>
            )
        }
        if (metaData) {
            return (
                <AccountMetaData metaData={metaData} metaDataGroups={metaDataGroups}/>
            )
        }
        if (escalate) {
            return (
                <AccountEscalation close={this.closeDialog} title={title} accountId={accountId}/>
            )
        } else {
            return (
                <div className="meta-dialog">
                    <h1>Assign account:</h1>
                    <div className="check-block">
                        <div className="check-group" onClick={this.showUserForm}>
                            <input id="a1" type="radio" name="assign" value="user" checked={assignToUser}/>
                            <label htmlFor="a1">User</label>
                        </div>
                        <div className="check-group" onClick={this.showQueueForm}>
                            <input id="a2" type="radio" name="assign" value="workQueue"/>
                            <label htmlFor="a2">Work Queue</label>
                        </div>
                    </div>
                    {
                        assignToUser ? (
                            <AutoForm model={model}
                                      schema={assignSchema}
                                      onSubmit={this.assignToUser}>
                                <div className="form-wrapper select-item">
                                    <AutoField labelHidden={true} name="assigneeId" options={options}/>
                                    <ErrorField name='assigneeId'/>
                                </div>
                                <div className="btn-group">
                                    <button className="btn-cancel" onClick={this.closeDialog}>Cancel</button>
                                    <button type="submit" className="btn--light-blue">
                                        Confirm
                                    </button>
                                </div>
                            </AutoForm>
                        ) : (
                            <AutoForm model={model}
                                      schema={workQueueSchema}
                                      onSubmit={this.assignToWorkQueue}>
                                <div className="form-wrapper select-item">
                                    <AutoField labelHidden={true} name="workQueue" options={workQueueOptions}/>
                                    <ErrorField name='workQueue'/>
                                </div>
                                <div className="btn-group">
                                    <button className="btn-cancel" onClick={this.closeDialog}>Cancel</button>
                                    <button type="submit" className="btn--light-blue">
                                        Confirm
                                    </button>
                                </div>
                            </AutoForm>
                        )
                    }
                </div>
            )
        }
    };

    render() {
        const {dialogIsActive} = this.state;
        const {type, title} = this.props;


        return (
            <button className="btn--white" onClick={this.openDialog}>
                <span>{type}</span>
                {
                    dialogIsActive &&
                    <Dialog className="account-dialog" closePortal={this.closeDialog} title={title}>
                        {this.showDialog()}
                    </Dialog>
                }
            </button>
        )
    }
}

const assignSchema = new SimpleSchema({
    assigneeId: {
        type: String
    }
});

const workQueueSchema = new SimpleSchema({
    workQueue: {
        type: String
    }
});
