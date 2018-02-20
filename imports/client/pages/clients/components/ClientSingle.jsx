import React, {Component} from 'react';
import {getImagePath} from "../../../../api/utils";
import classNames from 'classnames';

export default class ClientSingle extends Component {
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

    onSelectClient(e) {
        const {selectClient, id} = this.props;
        const {bgYellow} = this.state;

        this.setState({
            bgYellow: !bgYellow
        });
        selectClient(id);
        e.stopPropagation();
    }

    render() {
        const {bgYellow, open} = this.state;
        const {id, mail, avatar, name} = this.props;
        const classes = classNames({
            'list-item': true,
            'user-item': true,
            'bg--yellow': bgYellow
        });
        // {bgYellow ? "list-item user-item bg--yellow" : open ? "list-item user-item open" : "list-item user-item"}
        return (
            <div
                className={classes}
                onClick={this.renderContent}>
                <div className="check-item">
                    <input checked={bgYellow} type="checkbox" className="hidden"/>
                    <label onClick={this.onSelectClient.bind(this)}></label>
                </div>
                <div className="row__block align-center">
                    <div className="info">
                        <div className="person-name">{name}</div>
                        <div className="item-name text-blue">{mail}</div>
                    </div>
                    <img className="md-avatar img-circle" src={avatar ? getImagePath(avatar) : '/assets/img/user.svg'}/>
                </div>
            </div>
        );
    }
}