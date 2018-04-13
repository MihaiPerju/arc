import React, {Component} from 'react';
import {getImagePath} from "../../../../../api/utils";
import {roleGroups} from '/imports/api/users/enums/roles';
import Notifier from '/imports/client/lib/Notifier';
import Dialog from "/imports/client/lib/ui/Dialog";

export default class ClientContentHeader extends Component {
    constructor() {
        super();
        this.state = {
            dialogIsActive: false
        }
    }
    onEdit = () => {
        const {setEdit} = this.props;
        setEdit();
    };

    closeDialog = () => {
        this.setState({
            dialogIsActive: false
        });
    };

    confirmDisable = () => {
        this.setState({
            dialogIsActive: false
        });
        this.onDisableClient();
    };

    disableAction = (_id, status) => {
        this.setState({
            dialogIsActive: true,
            _id,
            status
        });
    };

    onClose = () => {
        const {setClient} = this.props;
        setClient();
    }

    onDisableClient = () => {
        const {_id, status} = this.state;
        Meteor.call('client.disable', _id, status, (err, res) => {
            if(!err) {
                Notifier.success('Client disabled !');
                this.onClose();
            }
        })
    };

    render() {
        const {client} = this.props;
        const {dialogIsActive} = this.state;
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
                            Roles.userIsInRole(Meteor.userId(), roleGroups.ADMIN_TECH) &&
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
                                <button type="button" onClick={() => this.disableAction(client._id, client.status)} className="btn--white">
                                    {client.status ? 'Disable client' : 'Enable client'}
                                </button>
                            </div>
                        }
                    </div>
                </div>
                {
                    dialogIsActive && (
                        <Dialog className="account-dialog" closePortal={this.closeDialog} title="Confirm">
                            <div className="form-wrapper">
                                Are you sure you want to {client.status ? 'disable' : 'enable'} this client?
                            </div>
                            <div className="btn-group">
                                <button className="btn-cancel" onClick={this.closeDialog}>Cancel</button>
                                <button className="btn--light-blue" onClick={this.confirmDisable}>Confirm & {client.status ? 'disable' : 'enable'}
                                </button>
                            </div>
                        </Dialog>
                    )
                }
            </div>
        )
    }
}