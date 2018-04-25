import React, {Component} from 'react';
import Notifier from "/imports/client/lib/Notifier";

export default class TagContentSingle extends Component {

    addTag = (_id, tagId) => {
        Meteor.call('tag.addTag', {_id, tagId}, (err, res) => {
            if(!err) {
                Notifier.success('Successfully added !')
            }
        })
    }

    removeTag = (_id, tagId) => {
        Meteor.call('tag.removeTag', {_id, tagId}, (err, res) => {
            if(!err) {
                Notifier.success('removed successfully !')
            }
        })
    }

	render() {
        const { userName, tags, userId, currentTag, tagIds } = this.props;
        const index = _.indexOf(tagIds, currentTag._id);

        return (
			<div className="note-item">
			    <div className="note-info">
			        <div className="info">
			            <div className="name">{userName}</div>
			            <div className="text text-light-grey">
                            {
                                tags.map((tag, index) => (
                                    <span key={index}><i className="icon-paperclip"/> {tag.name} </span>
                                ))
                            }
                        </div>
			        </div>
			    </div>
			    <div className="note-time">
                    {
                        index > -1 
                        ? <button onClick={() => this.removeTag(userId, currentTag._id)} className="btn-edit btn--white">Remove Tag</button>
                        : <button onClick={() => this.addTag(userId, currentTag._id)} className="btn-edit btn--white">Add Tag</button>
                    }
                </div>
			</div>
		)
	}
}