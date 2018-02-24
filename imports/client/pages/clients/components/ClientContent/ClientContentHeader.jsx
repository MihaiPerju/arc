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
                            <span className="text-light-grey">Email</span>
                            <span className="text text-blue">{client.email}</span>
                        </div>
                        <div className="btn-group">
                            <a href={"/client/" + client._id + "/manage-facilities"}
                               className="cc-button btn--white">
                                Manage facilities
                            </a>
                            <a href="#" className="cc-button btn--white">Manage regions</a>
                            <button className="btn--white">Edit client</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}