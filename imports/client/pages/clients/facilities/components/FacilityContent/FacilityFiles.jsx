import React, {Component} from 'react';
import query from '/imports/api/files/queries/listFiles';
import Notifier from '/imports/client/lib/Notifier';
import Dialog from "/imports/client/lib/ui/Dialog";
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import Loading from '/imports/client/lib/ui/Loading';

class FacilityFiles extends Component {
    constructor() {
        super();
        this.state = {
            dialogIsActive: false
        }
    }

    onRollBack = () => {
        const {_id} = this.state;

        Meteor.call("file.rollback", _id, (err) => {
            if (!err) {
                Notifier.success("File reverted");
                //And update again the files
                this.getFiles(this.props);
            } else {
                Notifier.error(err.reason);
            }
        })
    };

    closeDialog = () => {
        this.setState({
            dialogIsActive: false
        });
    };

    confirmDelete = () => {
        this.setState({
            dialogIsActive: false
        });
        this.onRollBack();
    };

    deleteAction = (_id) => {
        this.setState({
            dialogIsActive: true,
            _id
        });
    };

    render() {
        const {data, loading, error} = this.props;
        const {dialogIsActive} = this.state;

        if (loading) {
            return <Loading/>;
        }

        if (error) {
            return <div>Error: {error.reason}</div>;
        }
        return (
            <div className="action-block schedule-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">Files</div>
                </div>
                <div className="main__block">
                    <div className="schedule-list">
                        {
                            data.map((file, index) => {
                                return (
                                    <div key={index} className="schedule-item">
                                        <div className="left__side">
                                            <div className="info">
                                                <div className="text-light-grey">File Name</div>
                                                <div className="info-label">{file.fileName}</div>
                                            </div>
                                        </div>
                                        <div className="btn-group">
                                            <button onClick={this.deleteAction.bind(this, file._id)}
                                                    className="btn-cancel">Roll Back
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                {
                    dialogIsActive && (
                        <Dialog className="account-dialog" closePortal={this.closeDialog} title="Confirm Rollback">
                            <div className="form-wrapper">
                                Are you sure you want to revert all the changes?
                            </div>
                            <div className="btn-group">
                                <button className="btn-cancel" onClick={this.closeDialog}>Cancel</button>
                                <button className="btn--light-blue" onClick={this.confirmDelete}>Confirm & delete
                                </button>
                            </div>
                        </Dialog>
                    )
                }
            </div>
        )
    }
}

export default withQuery((props) => {
    const {facilityId} = props;
    return query.clone({filters: {facilityId}, options: {$sort: {createdAt: 1}}});
}, {reactive: true})(FacilityFiles);
