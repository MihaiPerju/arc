import React, {Component} from 'react';
import moment from "moment/moment";
import AssigneeSelect from '../AssigneeSelect';
import Dialog from "/imports/client/lib/ui/Dialog";

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
                            type={'Assignee'}
                            taskId={task._id}
                            options={userOptions}
                            title={"Assign account to someone"}
                        />
                        <ToggleDialog
                            escalate
                            type={'Escalate'}
                            title={''}
                        />
                        <ToggleDialog
                            metaData={metaData}
                            metaDataGroups={metaDataGroups}
                            type={'View Meta Data'}
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

    showDialog = () => {
        const {taskId, options, title, escalate, metaData, metaDataGroups} = this.props;
        if (metaData){
            return (
                <Dialog className="meta-dialog" closePortal={this.closeDialog} title={title}>
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
                </Dialog>
            )
        }
        if (escalate){
            return (
                <Dialog className="meta-dialog" closePortal={this.closeDialog} title={title}>
                    <div className="form-wrapper">
                        <input type="text" placeholder="Type escalation reason"/>
                    </div>
                    <div className="btn-group">
                        <button className="btn-cancel" onClick={this.closeDialog}>Cancel</button>
                        <button className="btn--light-blue">Confirm & send</button>
                    </div>
                </Dialog>
            )
        } else {
            return (
                <Dialog className="meta-dialog" closePortal={this.closeDialog} title={title}>
                    <div className="form-wrapper select-wrapper">
                        <AssigneeSelect
                            taskId={taskId}
                            options={options}
                        />
                    </div>
                    <div className="btn-group">
                        <button className="btn-cancel" onClick={this.closeDialog}>Cancel</button>
                        <button className="btn--light-blue">Confirm & send</button>
                    </div>
                </Dialog>
            )
        }
    }

    render() {
        const {dialogIsActive} = this.state;
        const {type} = this.props;
        return (
            <button className="btn--white" onClick={this.openDialog}>
                <span>{type}</span>
                {
                    dialogIsActive && this.showDialog()
                }
            </button>
        )
    }
}