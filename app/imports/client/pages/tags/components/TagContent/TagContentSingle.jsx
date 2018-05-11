import React, { Component } from 'react';
import Notifier from "/imports/client/lib/Notifier";

export default class TagContentSingle extends Component {

    removeTag = (_id, tagId) => {
        Meteor.call('user.removeTag', { _id, tagId }, (err, res) => {
            if (!err) {
                Notifier.success('removed successfully !')
            }
        })
    }

    render() {
        const { userName, userId, currentTag } = this.props;

        return (
            <div>
                <div className="table-row">
                    <div className="right-side">
                        <div className="table-field text-center">
                            {userName}
                        </div>
                        <div className="table-field text-center">
                            <button onClick={() => this.removeTag(userId, currentTag._id)} className="btn-edit btn--white">remove user</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}