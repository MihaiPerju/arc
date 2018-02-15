import React, {Component} from 'react';

export default class TaskSingle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontNormal: false,
            checked: false,
            open: false
        };

        // this.renderContent = this.renderContent.bind(this);
        // this.changeTaskBg = this.changeTaskBg.bind(this);
    }

    renderContent() {
        const {manageTask, task} = this.props;
        // manageTask(task);
        const {open} = this.state;
        this.setState({
            fontNormal: true,
            open: !open
        });
        this.props.renderContent();
    }

    onCheck() {
        const {checkTask, task} = this.props;
        checkTask(task);
    }

    onSelectTask() {
        const {selectTask, task} = this.props;
        selectTask(task);
    }

    render() {
        const {task, active} = this.props;
        const {open} = this.state;
        return (
            <div className={
                active ? "list-item task-item bg--yellow" : open ? "list-item task-item open" : "list-item task-item"}
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
                            className={this.state.fontNormal ? "person font-normal" : "person"}>{task.client && task.client.clientName}</div>
                    </div>
                    <div className="right__side">
                        <div className="pacient-id text-blue">{task.client && task.client._id}</div>
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