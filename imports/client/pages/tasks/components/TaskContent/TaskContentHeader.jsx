import React, {Component} from 'react';
import moment from "moment/moment";
import Dialog from "/imports/client/lib/ui/Dialog";
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';

export default class TaskContentHeader extends Component {
    constructor() {
        super();
    }

    groupFields(fields) {
        const numInRow = 5;
        const numGroups = Math.ceil(fields.length / numInRow);
        let result = [];
        for (let i = 0; i < numGroups; i++) {
            const startIndex = i * numInRow;
            const finishIndex = Math.min((i + 1) * numInRow, fields.length);
            const groupOfFields = fields.slice(startIndex, finishIndex);
            result.push(groupOfFields);
        }
        return result;
    }

    getOptions(users) {
        let options = [];
        if (users) {
            for (user of users) {
                let item = {
                    label: user && user.profile && user.profile.firstName + ' ' + user.profile.lastName + '(' + user.roles[0] + ')',
                    value: user && user._id
                };
                options.push(item);
            }
        }
        return options;
    }

    getFirstOption(task, options) {
        if (task.assigneeId) {
            for (option of options) {
                if (option.value === task.assigneeId) {
                    return [option];
                }
            }
        }
        return [{label: 'Unassigned'}];
    }

    render() {
        const {task} = this.props;
        const {metaData} = task;
        const options = this.getOptions(task && task.facility && task.facility.users);
        let userOptions = this.getFirstOption(task, options).concat(options);
        const metaDataGroups = this.groupFields(Object.keys(metaData));

        return (
            <div className="header-block header-account">
                <div className="main-info">
                    <div className="left__side">
                        <div className="name">
                            {task.client && task.client.clientName}
                        </div>
                        <div className="row__block">
                            <div className="pacient-id text-blue">{task.acctNum}</div>
                            <div className="financial-class">O/D</div>
                            <div className="location">{task.facility && task.facility.name}</div>
                            <div className="label-group">
                                <div className="label label--green">158 points(TBM)</div>
                                <div className="label label--grey text-uppercase">carc(TNM)</div>
                                <div className="label label--grey">Work queue(TBM)</div>
                            </div>
                        </div>
                    </div>
                    <div className="right__side">
                        <div className="price-col">
                            <div className="price">{task.collectedAmount}</div>
                            <div className="text-light-grey">Collected amount</div>
                        </div>
                        <div className="price-col">
                            <div className="price">{task.acctBal ? task.acctBal : 0}</div>
                            <div className="text-light-grey">Remaining balance</div>
                        </div>
                    </div>
                    <div className="btn-group">
                        <ToggleDialog
                            type={'Assign'}
                            model={task}
                            accountId={task._id}
                            options={userOptions}
                            title={"Assign account to someone"}
                        />
                        <ToggleDialog
                            escalate
                            taskId={task._id}
                            type={'Escalate'}
                            title={''}
                        />
                        <ToggleDialog
                            metaData={metaData}
                            metaDataGroups={metaDataGroups}
                            type={'View Meta Data'}
                        />
                        <ToggleDialog
                            tickle={true}
                            type="Tickle"
                            accountId={task._id}
                            title="Tickle an account"
                        />
                    </div>
                </div>
                <div className="additional-info">
                    <ul>
                        <li className="text-center">
                            <div className="text-light-grey">Substate</div>
                            <div className="text-dark-grey text-uppercase">{task.substate}</div>
                        </li>
                        <li className="text-center">
                            <div className="text-light-grey">Financial class</div>
                            <div
                                className="text-dark-grey text-uppercase">{task.finClass ? task.finClass : "None"}</div>
                        </li>
                        <li className="text-center">
                            <div className="text-light-grey">Admin date</div>
                            <div className="text-dark-grey">{task && moment(task.admitDate).format('MM/DD/YYYY')}</div>
                        </li>
                        <li className="text-center">
                            <div className="text-light-grey">Discharge date</div>
                            <div
                                className="text-dark-grey">{task && moment(task.dischrgDate).format('MM/DD/YYYY')}</div>
                        </li>
                        <li className="text-center">
                            <div className="text-light-grey">Placement date</div>
                            <div className="text-dark-grey">{task && moment(task.createdAt).format('MM/DD/YYYY')}</div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

class ToggleDialog extends Component {
    constructor() {
        super();
        this.state = {
            dialogIsActive: false
        }
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

    assign = ({assigneeId}) => {
        const {accountId} = this.props;
        Meteor.call('task.assignee_change', {_id: accountId, assigneeId}, (err) => {
            if (!err) {
                Notifier.success('Assignee changed!');
                this.closeDialog();
            } else {
                Notifier.error(err.reason);
            }
        })
    };

    showDialog = () => {
        const {task, options, title, escalate, metaData, metaDataGroups, tickle} = this.props;
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
                <div>
                    <div className="meta-dialog" title={title}>
                        <AutoForm model={task}
                                  schema={assignSchema}
                                  onSubmit={this.assign}>
                            <div className="form-wrapper">
                                <AutoField labelHidden={true} name="assigneeId" options={options}/>
                                <ErrorField name='assigneeId'/>
                            </div>
                            <div className="btn-group">
                                <button className="btn-cancel" onClick={this.closeDialog}>Cancel</button>
                                <button type="submit" className="btn--light-blue">
                                    Confirm & send
                                </button>
                            </div>
                        </AutoForm>
                    </div>
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