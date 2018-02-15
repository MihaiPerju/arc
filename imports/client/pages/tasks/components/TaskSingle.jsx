import React, {Component} from 'react';

export default class TaskSingle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontNormal: false,
            bgYellow: false,
            open: false
        };

        this.renderContent = this.renderContent.bind(this);
        this.changeTaskBg = this.changeTaskBg.bind(this);
    }

    renderContent() {
        const {manageTask, task} = this.props;
        manageTask(task);
        const {open} = this.state;
        this.setState({
            fontNormal: true,
            open: !open
        });
        this.props.renderContent();
    }

    changeTaskBg() {
        this.setState({
            bgYellow: !this.state.bgYellow
        });
        this.props.showBtnGroup();
    }

    render() {
        const {task} = this.props;
        const {open, bgYellow} = this.state;
        return (
            <div className={
                bgYellow ? "list-item task-item bg--yellow" : open ? "list-item task-item open" : "list-item task-item"}
                 onClick={this.renderContent}
            >
                <div className="check-item">
                    <input type="checkbox" id="11" className="hidden"/>
                    <label htmlFor="11" onClick={this.changeTaskBg}></label>
                </div>
                <div className="mark-task">
                    <input type="checkbox" id="1" className="hidden"/>
                    <label htmlFor="1"></label>
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