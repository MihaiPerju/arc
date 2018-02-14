import React, {Component} from 'react';

export default class ActionSingle extends Component {
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
        // this.props.showBtnGroup();
    }

    manageCodes = () => {
        const {action, reasonCodesManage} = this.props;
        reasonCodesManage(action._id);
    }
    
    render() {

        return (
            <div className={this.state.bgYellow ? "list-item task-item bg--yellow" : this.state.open ? "list-item task-item open" : "list-item task-item"}
            onClick={this.renderContent}>
                <div className="check-item">
                    <input id={this.props.id} type="checkbox" className="hidden"/>
                    <label htmlFor={this.props.id} onClick={this.changeTaskBg}></label>
                </div>
                <div className="row__block align-center">
                    <div className="item-name">{this.props.name}</div>
                </div>
            </div>
        );
    }
}