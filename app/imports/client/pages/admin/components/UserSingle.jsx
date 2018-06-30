import React, {Component} from 'react';
import {getImagePath} from '/imports/api/utils';
import classNames from 'classnames';

export default class UserSingle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontNormal: false,
            open: false
        }
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

    setUser() {
        const {user, setUser} = this.props;
        setUser(user._id)
    }

    onSelectUser(e) {
        e.stopPropagation();
        const {user, selectUser} = this.props;
        selectUser(user._id)
    }

    render() {
        const {user, setUser, usersSelected, open} = this.props;
        const classes = classNames({
            "list-item": true,
            "user-item": true,
            "bg--yellow": usersSelected.includes(user._id),
            "open": open
        })
        // className={bgYellow ? "list-item user-item bg--yellow" : open ? "list-item user-item open" : "list-item user-item"}
        return (
            <div
                className={classes}
                onClick={this.setUser.bind(this)}>
                <div className="check-item">
                    <input checked={usersSelected.includes(user._id)} type="checkbox" className="hidden"/>
                    <label onClick={this.onSelectUser.bind(this)}></label>
                </div>
                <div className="row__block align-center">
                    <div className="item-name text-blue">{user.emails && user.emails[0].address}</div>
                    <img src={user.avatar ? getImagePath(user.avatar.path) : "/assets/img/user1.svg"}
                         className="md-avatar img-circle"
                         alt=""/>
                </div>
            </div>
        );
    }
}