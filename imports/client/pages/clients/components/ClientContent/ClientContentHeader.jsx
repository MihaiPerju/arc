import React, {Component} from 'react';
import {getImagePath} from "../../../../../api/utils";
import RolesEnum from '/imports/api/users/enums/roles';

export default class ClientContentHeader extends Component {
    onEdit = () => {
        const {setEdit} = this.props;
        setEdit();
    };

    render() {
        const {client} = this.props;
        return (
            <div className="header-block">
                <img src={client.logoPath ? getImagePath(client.logoPath) : '/assets/img/user.svg'}
                     className="lg-avatar img-circle"
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
                        {
                            Roles.userIsInRole(Meteor.userId(), RolesEnum.ADMIN) &&
                            <div className="btn-group">
                                <a href={FlowRouter.url('region.list', {id: client._id})}
                                   className="cc-button btn--white">
                                    Manage regions
                                </a>
                                <a href={"/client/" + client._id + "/manage-facilities"}
                                   className="cc-button btn--white">
                                    Manage facilities
                                </a>
                                <button onClick={this.onEdit} className="btn--white">Edit
                                    client
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}