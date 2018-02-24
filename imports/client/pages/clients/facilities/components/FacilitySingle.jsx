import React, {Component} from 'react';

export default class FacilitySingle extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        const { bgYellow, open } = this.state;
        const { id, name, avatar } = this.props;

        return (
            <div className={bgYellow ? "list-item user-item bg--yellow" : open ? "list-item user-item open" : "list-item user-item"}
                onClick={this.renderContent}>
                <div className="check-item">
                    <input id={id} type="checkbox" className="hidden"/>
                    <label htmlFor={id} onClick={this.changeTaskBg}></label>
                </div>
                <div className="row__block align-center">
                    <div className="item-name">{name}</div>
                    <img src={avatar} alt="" className="md-avatar"/>
                </div>
            </div>
        )
    }
}