import React, {Component} from 'react';
import Notifier from "/imports/client/lib/Notifier";

export default class TagContentSingle extends Component {

    removeTag = (_id, tagId) => {
        Meteor.call('user.removeTag', {_id, tagId}, (err, res) => {
            if (!err) {
                Notifier.success('removed successfully !')
            }
        })
    }

    render() {
        const {userName, userId, currentTag} = this.props;

        return (
            <div className="action-table__row flex--helper">
                <div className="action-table__field truncate">
                    <div className="check-item">
                        <input id={userId} type="checkbox" className="hidden"/>
                        <label htmlFor={userId}/>
                    </div>
                    {userName}
                </div>
                <div className="action-table__field text-center">
                    <button onClick={() => this.removeTag(userId, currentTag._id)} className="btn-edit btn--red">
                        Remove user
                    </button>
                </div>
            </div>
        )
    }
}