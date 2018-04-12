import React, {Component} from 'react';
import moment from "moment/moment";
import AccountActioning from './AccountActioning';

import tagQuery from "/imports/api/tags/queries/listTags";

export default class TaskContentHeader extends Component {
    constructor() {
        super();
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
        const {task, openMetaData} = this.props;
        const options = this.getOptions(task && task.facility && task.facility.users);
        let userOptions = this.getFirstOption(task, options).concat(options);
        return (
            <div className="header-block header-account">
                <div className="main-info">
                    <div className="left__side">
                        <div className="name">
                            {task.ptName}
                        </div>
                        <div className="row__block">
                            <div className="pacient-id text-blue">{task.acctNum}</div>
                            <div className="financial-class">O/D</div>
                            <div className="location">{task.facility && task.facility.name}</div>
                            <div className="label-group">
                                <div className="label label--green">158 points(TBM)</div>
                                <div className="label label--grey text-uppercase">CARC(TNM)</div>
                                <div
                                    className="label label--grey">{task.workQueue && task.tag.name}</div>
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
                        <AccountActioning
                            type={'Assign'}
                            model={task}
                            accountId={task._id}
                            options={userOptions}
                        />
                        <AccountActioning
                            escalate
                            accountId={task._id}
                            type="Escalate"
                            title="Escalate"
                        />
                        <AccountActioning
                            metaData={true}
                            type="View Meta Data"
                            openMetaData={openMetaData}
                        />
                        <AccountActioning
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
                            <div className="text-light-grey">Admit date</div>
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