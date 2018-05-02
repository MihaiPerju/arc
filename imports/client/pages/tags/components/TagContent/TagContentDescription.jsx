import React, {Component} from 'react';
import TagContentSingle from './TagContentSingle';

export default class TagContentDescription extends Component {
	render() {
        const {users, currentTag} = this.props;

		return(
			<div className="action-block">
			    <div className="header__block">
			        <div className="title-block text-uppercase">Users</div>
			    </div>
			    <div className="note-list">
			        {
			            users.map(function(user, index){
			                return (
			                    <TagContentSingle
			                        key={index}
                                    userName={`${user.profile.firstName} ${user.profile.lastName}`}
                                    tags={user.tags}
                                    userId={user._id}
                                    currentTag={currentTag}
                                    tagIds={user.tagIds || []}
			                    />
			                )
			            })
			        }
			    </div>
			</div>
		)
	}
}