import React from 'react';
import autoBind from 'react-autobind';
import moment from 'moment';
import {getImagePath} from "../../../../api/utils";

export default class CommentSingle extends React.Component {
    constructor() {
        super();

        autoBind(this);
    }

    render() {
        const {comment} = this.props;
        console.log(comment);
        const {author} = comment;

        return (
                <div className="comment-item">
                    <div className="comment__wrapper">
                        <img className="md-avatar img-circle"
                             src={author && author.avatar ? getImagePath(author.avatar.path) : '/assets/img/user.svg'}
                             alt=""/>
                        <div className="name">
                            {author && author.profile.firstName + ' ' + author.profile.lastName}
                        </div>
                        <div className="message text-light-grey">
                            {comment.content}
                        </div>
                    </div>
                    <div className="time">
                        {comment && moment(comment.createdAt).format('hh:mm')}
                    </div>
                </div>
        )
    }
}