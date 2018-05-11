import React from "react";
import Dialog from "/imports/client/lib/ui/Dialog";
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';
import Notifier from '/imports/client/lib/Notifier';

import AccountMetaData from "./AccountMetaData";
import AccountTickle from "./AccountTickle";
import AccountEscalation from "./AccountEscalation";
import AccountAssign from "./AccountAssign";

export default class AccountActioning extends React.Component {
    constructor() {
        super();
        this.state = {
            dialogIsActive: false
        }
    }

    openDialog = () => {
        this.setState({
            dialogIsActive: true
        });
    };

    closeDialog = () => {
        this.setState({
            dialogIsActive: false
        })
    };

    showDialog = () => {
        const {model, accountId, options, title, escalate, metaData, metaDataGroups, tickle, openMetaData, closeRightPanel} = this.props;

        if (tickle) {
            return (
                <AccountTickle accountId={accountId} close={this.closeDialog} closeRightPanel={closeRightPanel}/>
            )
        }
        if (metaData) {
            openMetaData();
        }
        if (escalate) {
            return (
                <AccountEscalation close={this.closeDialog} title={title} accountId={accountId} closeRightPanel={closeRightPanel}/>
            )
        } else {
            return (
                <AccountAssign accountId={accountId} userOptions={options} close={this.closeDialog} model={model} closeRightPanel={closeRightPanel}/>
            )
        }
    };

    render() {
        const {dialogIsActive} = this.state;
        const {type, title} = this.props;


        return (
            <button className="btn--white" onClick={this.openDialog}>
                <span>{type}</span>
                {
                    dialogIsActive &&
                    <Dialog className="account-dialog" closePortal={this.closeDialog} title={title}>
                        {this.showDialog()}
                    </Dialog>
                }
            </button>
        )
    }
}
