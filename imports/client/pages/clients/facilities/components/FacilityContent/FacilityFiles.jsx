import React, {Component} from 'react';
import query from '/imports/api/files/queries/listFiles';
import Notifier from '/imports/client/lib/Notifier';
import Dialog from "/imports/client/lib/ui/Dialog";
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import Loading from '/imports/client/lib/ui/Loading';

class FacilityFiles extends Component {
    onRollBack = (_id) => {
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

    render() {
        const {data, loading, error} = this.props;
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
                                            <button onClick={this.onRollBack.bind(this, file._id)}
                                                    className="btn-cancel">Roll Back
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default withQuery((props) => {
    const {facilityId} = props;
    return query.clone({filters: {facilityId}, options: {$sort: {createdAt: 1}}});
}, {reactive: true})(FacilityFiles);
