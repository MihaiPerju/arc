import React, {Component} from 'react';
import moment from "moment/moment";
import AssigneeSelect from '../AssigneeSelect';

export default class TaskContentHeader extends Component {

    getOptions (users) {
        if (!users) {
            [];
        }

        let options = [];
        for (user of users) {
            let item = {
                label: user && user.profile && user.profile.firstName + ' ' + user.profile.lastName + '(' + user.roles[0] + ')',
                value: user && user._id
            };
            options.push(item);
        }
        return options;
    }

    getFirstOption (task, options) {
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
        const options = this.getOptions(task && task.facility && task.facility.users);
        let userOptions = this.getFirstOption(task, options).concat(options);

        return (
            <div className="header-block">
                <div className="main-info">
                    <div className="left__side">
                        <div className="name">
                            {task.client && task.client.clientName}
                            <AssigneeSelect taskId={task._id} options={userOptions}/>
                        </div>
                        <div className="row__block">
                            <div className="pacient-id text-blue">{task.client && task.client._id}</div>
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
                            <div className="price">0.00(TBM)</div>
                            <div className="text-light-grey">Collected amount</div>
                        </div>
                        <div className="price-col">
                            <div className="price">18,586(TBM)</div>
                            <div className="text-light-grey">Remaining balance</div>
                        </div>
                    </div>
                </div>
                <div className="additional-info">
                    <ul>
                        <li className="text-center">
                            <div className="text-light-grey">Status Code</div>
                            <div className="text-dark-grey text-uppercase">invden(TBM)</div>
                        </li>
                        <li className="text-center">
                            <div className="text-light-grey">Financial class</div>
                            <div className="text-dark-grey text-uppercase">{task.finClass}</div>
                        </li>
                        <li className="text-center">
                            <div className="text-light-grey">Admin date</div>
                            <div className="text-dark-grey">{task && moment(task.admitDate).format('MM/DD/YYYY')}</div>
                        </li>
                        <li className="text-center">
                            <div className="text-light-grey">Discharge date</div>
                            <div className="text-dark-grey">{task && moment(task.dischrgDate).format('MM/DD/YYYY')}</div>
                        </li>
                        <li className="text-center">
                            <div className="text-light-grey">Placement date</div>
                            <div className="text-dark-grey">12/05/2018(TBM)</div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}