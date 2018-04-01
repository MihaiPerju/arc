import React from "react";
import Dialog from "/imports/client/lib/ui/Dialog";
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';
import WorkQueueService from './../../services/WorkQueueService';
import workQueueQuery from "/imports/api/tags/queries/listTags";

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
    }

    showUserForm = () => {
        this.setState({
            assignToUser: true,
            assignToWorkQueue: false
        })
    }

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

    escalate = ({reason}) => {
        const {taskId} = this.props;
        Meteor.call("account.escalate", {reason, taskId}, (err) => {
            if (!err) {
                Notifier.success("Account escalated!");
                this.closeDialog();
            } else {
                Notifier.error(err.reason);
            }
        })
    };

    tickle = (data) => {
        const {accountId} = this.props;
        data._id = accountId;
        Meteor.call("account.tickle", data, (err) => {
            if (!err) {
                Notifier.success("Account Tickled!");
                this.closeDialog();
            } else {
                Notifier.error(err.reason);
            }
        })
    };

    assignToUser = ({assigneeId}) => {
        const {accountId} = this.props;
        Meteor.call('account.assignUser', {_id: accountId, assigneeId}, (err) => {
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
        const {model, options, title, escalate, metaData, metaDataGroups, tickle} = this.props;
        const {workQueueOptions, assignToUser, assignToWorkQueue} = this.state;

        if (tickle) {
            return (
                <div className="create-form">
                    <div className="create-form__wrapper">
                        <div className="action-block">
                            <main className="cc-main">
                                <AutoForm onSubmit={this.tickle} schema={tickleSchema}>
                                    <div className="filter-type__wrapper">
                                        <div className="input-datetime">
                                            <AutoField placeholder="Select tickle date" labelHidden={true}
                                                       name="tickleDate"/>
                                            <ErrorField name="tickleDate"/>
                                        </div>
                                    </div>
                                    <div className="btn-group">
                                        <button className="btn-cancel" onClick={this.closeDialog}>Cancel</button>
                                        <button type="submit" className="btn--light-blue">
                                            Confirm & send
                                        </button>
                                    </div>
                                </AutoForm>
                            </main>
                        </div>
                    </div>
                </div>
            )
        }
        if (metaData) {
            return (
                <div>
                    <div className="main-content">
                        <div className="header-block header-account">
                            <div className="main-content__header header-block">
                                <div className="row__header">
                                    <div className="row__wrapper">
                                        <div className="title text-center">Meta Data</div>
                                    </div>
                                </div>
                            </div>
                            <div className="additional-info">
                                {
                                    metaDataGroups && (
                                        metaDataGroups.map((group) => {
                                            return (
                                                <div className="additional-info">
                                                    <ul>
                                                        {
                                                            group.map((element, index) => {
                                                                return (
                                                                    <li className="text-center" key={index}>
                                                                        <div className="text-light-grey">{element}</div>
                                                                        <div className="text-dark-grey text-uppercase">
                                                                            {metaData[element]}
                                                                        </div>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            )
                                        })
                                    )
                                }
                                <ul>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="btn-group">
                        <button className="btn-cancel" onClick={this.closeDialog}>Close</button>
                    </div>
                </div>
            )
        }
        if (escalate) {
            return (
                <div className="meta-dialog" title={title}>
                    <AutoForm onSubmit={this.escalate} schema={escalateSchema}>
                        <div className="form-wrapper">
                            <AutoField labelHidden={true} placeholder="Type Escalation Reason" name="reason"/>
                            <ErrorField name="reason"/>
                        </div>
                        <div className="btn-group">
                            <button className="btn-cancel" onClick={this.closeDialog}>Cancel</button>
                            <button type="submit" className="btn--light-blue">
                                Confirm & send
                            </button>
                        </div>
                    </AutoForm>
                </div>
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

const escalateSchema = new SimpleSchema({
    reason: {
        type: String
    }
});

const tickleSchema = new SimpleSchema({
    tickleDate: {
        type: Date
    }
});

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
