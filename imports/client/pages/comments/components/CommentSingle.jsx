import React from 'react';
import {Comment} from 'semantic-ui-react'
import autoBind from 'react-autobind';
import moment from 'moment';
import {path} from '/imports/api/s3-uploads/utils';

export default class CommentSingle extends React.Component {
    constructor() {
        super();

        autoBind(this);
    }

    render() {
        const {comment} = this.props;
        const {author} = comment;

        return (
            <div>
                <Comment>
                    <Comment.Avatar
                        src={author && author.avatar ? path(author.avatar.path) : 'https://www.dontshake.org/media/k2/items/cache/71f67488b0857639cee631943a3fc6fa_XL.jpg'}/>
                    <Comment.Content>
                        <Comment.Author
                            as='a'>{
                            author && author.profile.firstName + ' ' + author.profile.lastName
                        }
                        </Comment.Author>
                        <Comment.Metadata>
                            <div>{comment && moment(comment.createdAt).format('MM/DD/YYYY hh:mm')}</div>
                        </Comment.Metadata>
                        <Comment.Text>{comment.content}</Comment.Text>
                    </Comment.Content>
                </Comment>
            </div>
        )
    }
}