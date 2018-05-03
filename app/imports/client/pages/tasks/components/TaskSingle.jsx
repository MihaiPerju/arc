import React, {Component} from 'react';
import classNames from 'classnames';
import moment from "moment/moment";

export default class TaskSingle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontNormal: false,
            checked: false
        };
    }

    onCheck(e) {
        e.stopPropagation();
        const {checkTask, task} = this.props;
        checkTask(task);
    }

    onSelectTask() {
        const {selectTask, task} = this.props;
        selectTask(task);
    }

    render() {
        const {task, active, currentTask} = this.props;
        const classes = classNames({
            'list-item task-item': true,
            'open': task._id === currentTask,
            'bg--yellow': active
        });

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
                            className={this.state.fontNormal ? 'person font-normal' : 'person'}>{task.ptName}</div>
                    </div>
                    <div className="right__side">
                        <div className="pacient-id text-blue">
                            {task.acctNum}
                        </div>
                        <div className="financial-class">O/D</div>
                        <div className="time">{task && moment(task.createdAt).format(' hh:mm')}</div>
                    </div>
                </div>
                <div className="row__item">
                    <div className="price">{task.acctBal}</div>
                    <div className="location">{task.facility && task.facility.name}</div>
                </div>
            </div>
        );
    }
}