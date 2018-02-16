import React, {Component} from 'react';

export default class LetterTemplateSingle extends Component {
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
        const { bgYellow, open } = this.state;
        const { id, title } = this.props;

        return (
            <div className={bgYellow ? "list-item bg--yellow" : open ? "list-item open" : "list-item"}
            onClick={this.renderContent}>
                <div className="check-item">
                    <input id={id} type="checkbox" className="hidden"/>
                    <label htmlFor={id} onClick={this.changeTaskBg}></label>
                </div>
                <div className="row__block align-center">
                    <div className="item-name">{title}</div>
                </div>
            </div>
        );
    }
}