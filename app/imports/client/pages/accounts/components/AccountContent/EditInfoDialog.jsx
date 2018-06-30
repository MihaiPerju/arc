import React, {Component} from 'react';
import Dialog from "/imports/client/lib/ui/Dialog";

export default class EditInfoDialog extends Component {
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
        });
    };

    render() {
        const {dialogIsActive} = this.state;
        const {children} = this.props;

        return (
            <button className="edit-info__btn" onClick={this.openDialog}>
                <i className="icon-pencil"/>
                {
                    dialogIsActive && (
                        <Dialog className="account-dialog"
                                closePortal={this.closeDialog}
                                title={"Edit info:"}
                        >
                            {children}
                        </Dialog>
                    )
                }
            </button>
        )
    }
}