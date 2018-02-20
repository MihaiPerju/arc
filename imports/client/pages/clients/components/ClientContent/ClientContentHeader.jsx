import React, {Component} from 'react';

export default class ClientContentHeader extends Component {
    render() {
        return (
            <div className="header-block">
                <img className="lg-avatar" src="/assets/img/user.svg" alt=""/>
                <div className="header-block__wrapper">
                    <div className="intro-row">
                        <div className="text-light-grey">Client name</div>
                        <div className="name">Martinello Trello</div>
                    </div>
                    <div className="info-row">
                        <div className="info-item">
                            <div className="text-light-grey">Last name</div>
                            <div className="text">Trello</div>
                        </div>
                        <div className="info-item">
                            <div className="text-light-grey">First name</div>
                            <div className="text">Martinello</div>
                        </div>
                        <div className="info-item">
                            <div className="text-light-grey">First name</div>
                            <div className="text text-blue">contact@email.com</div>
                        </div>
                        <button className="btn--white">Edit client</button>
                    </div>
                </div>
            </div>
        )
    }
}