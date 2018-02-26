import React, { Component } from 'react';
import classNames from 'classnames';
import AssigneeSelect from './AssigneeSelect';

export default class TaskSingle extends Component {
    constructor (props) {
        super(props);
        this.state = {
            fontNormal: false,
            checked: false
        };
    }

    onCheck (e) {
        e.stopPropagation();
        const {checkTask, task} = this.props;
        checkTask(task);
    }

    onSelectTask () {
        const {selectTask, task} = this.props;
        selectTask(task);
    }

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

    render () {
        const {task, active, currentTask} = this.props;
        const classes = classNames({
            'list-item task-item': true,
            'open': task._id === currentTask,
            'bg--yellow': active
        });
        const options = this.getOptions(task && task.facility && task.facility.users);
        let userOptions = this.getFirstOption(task, options).concat(options);

        console.log(task.facility);

        return (
            <div className={classes}
                 onClick={this.onSelectTask.bind(this)}
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
                            className={this.state.fontNormal ? 'person font-normal' : 'person'}>{task.client && task.client.clientName}</div>
                    </div>
                    <div className="right__side">
                        <div className="pacient-id text-blue">
                            {task.client && task.client._id}
                            <AssigneeSelect taskId={task._id} options={userOptions}/>
                        </div>
                        <div className="financial-class">O/D</div>
                        <div className="time">11:20 am</div>
                    </div>
                </div>
                <div className="row__item">
                    <div className="price">18,586</div>
                    <div className="location">{task.facility && task.facility.name}</div>
                </div>
            </div>
        );
    }
}