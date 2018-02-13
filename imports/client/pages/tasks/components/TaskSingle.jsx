import React, {Component} from 'react';

export default class TaskSingle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontNormal: false,
            bgYellow: false,
            open: false
        }
        this.renderContent = this.renderContent.bind(this);
        this.changeTaskBg = this.changeTaskBg.bind(this);        
    }

    renderContent() {
        this.setState({
            fontNormal: true,
            open: !this.state.open
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
        return (
            <div className={
                    this.state.bgYellow ? "list-item task-item bg--yellow" : this.state.open ? "list-item task-item open" : "list-item task-item"}
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
                        <div className={this.state.fontNormal ? "person font-normal" : "person"}>Solomon Ben</div>
                    </div>
                    <div className="right__side">
                        <div className="pacient-id text-blue">MBG981828112</div>
                        <div className="financial-class">O/D</div>
                        <div className="time">11:20 am</div>
                    </div>
                </div>
                <div className="row__item">
                    <div className="price">18,586</div>
                    <div className="location">New York-Presbyterian University Hospital</div>
                </div>
            </div>
        );
    }
}