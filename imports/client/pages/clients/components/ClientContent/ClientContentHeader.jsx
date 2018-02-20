import React, {Component} from 'react';
import {getImagePath} from "../../../../../api/utils";

export default class ClientContentHeader extends Component {
    render() {
        const {client} = this.props;
        return (
            <div className="header-block">
                <img src={client.logoPath ? getImagePath(client.logoPath) : '/assets/img/user.svg'}
                     className="lg-avatar"
                     alt=""/>
                <div className="header-block__wrapper">
                    <div className="intro-row">
                        <div className="text-light-grey">Client name</div>
                        <div className="name">{client.clientName}</div>
                    </div>
                    <div className="info-row">
                        <div className="info-item">
                            <div className="text-light-grey">Email</div>
                            <div className="text text-blue">{client.email}</div>
                        </div>
                        <button className="btn--white">Edit client</button>
                    </div>
                </div>
            </div>
        )
    }
}