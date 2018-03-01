import React from 'react';
import {getImagePath} from "../../../../api/utils";

export default class UserContentHeader extends React.Component {
    onEdit = () => {
        const {setEdit} = this.props;
        setEdit();
    };

    render() {
        const {user} = this.props;
        console.log(user);
        return (
            <div className="flex-content">
                <div className="intro-block text-center">
                    <img src={user.avatar ? getImagePath(user.avatar.path) : "/assets/img/user1.svg"}
                         className="lg-avatar img-circle"
                         alt=""/>
                    <div className="info">
                        <div className="text-light-grey">User name</div>
                        <div
                            className="text-blue email">{user.profile && user.profile.firstName + " " + user.profile.lastName}</div>
                    </div>
                </div>
                <ul className="row__info">
                    <li>
                        <span className="text-light-grey">First name</span>
                        <span className="info-label">{user.profile && user.profile.firstName}</span>
                    </li>
                    <li>
                        <span className="text-light-grey">Last name</span>
                        <span className="info-label">{user.profile && user.profile.lastName}</span>
                    </li>
                    <li>
                        <span className="text-light-grey">Phone</span>
                        <span className="info-label">{user.profile.phoneNumber}</span>
                    </li>
                </ul>
                <button onClick={this.onEdit} className="btn-edit btn--white">Edit user</button>
            </div>
        )
    }
}