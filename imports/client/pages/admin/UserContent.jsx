import React, {Component} from 'react';

export default class UserContent extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="main-content flex-content user-content">
                <div className="intro-block text-center">
                    <img className="lg-avatar img-circle" src="/assets/img/user.svg" alt=""/>
                    <div className="info">
                        <div className="text-light-grey">User name</div>
                        <div className="text-blue email">contomestchii@email</div>
                    </div>
                </div>
                <ul className="row__info">
                    <li>
                        <span className="text-light-grey">First name</span>
                        <span className="info-label">Chester</span>
                    </li>
                    <li>
                        <span className="text-light-grey">Last name</span>
                        <span className="info-label">Schroeder</span>
                    </li>
                    <li>
                        <span className="text-light-grey">Phone</span>
                        <span className="info-label">(456) 789-2345</span>
                    </li>
                </ul>
                <button className="btn-edit btn--white">Edit user</button>
            </div>
        )
    }
}