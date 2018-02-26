import React, {Component} from 'react';
import CommentSingle from './CommentSingle.jsx';
import {Container} from 'semantic-ui-react'
import Loading from '/imports/client/lib/ui/Loading';
import {Comment, Divider, Header} from 'semantic-ui-react'
import autoBind from 'react-autobind';
import Notifier from '/imports/client/lib/Notifier';
import {AutoForm, AutoField, ErrorField, SelectField} from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import {getImagePath} from "../../../../api/utils";

export default class CommentList extends Component {

    constructor() {
        super();

        this.state = {
            content: null
        };

        autoBind(this);
    }

    onSubmit({content}) {
        const {taskId} = this.props;
        if (!content) {
            Notifier.error("Message has no content");
        } else {
            Meteor.call("comment.create", content, taskId, (err) => {
                if (!err) {
                    Notifier.success("Comment added!");
                    this.refs.comment.reset();
                } else {
                    Notifier.error(err.reason);
                }
            })
        }
    }

    render() {
        const {data, loading, error} = this.props;
        const {path} = Meteor.user() && Meteor.user().avatar;
        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }

        return (
            <Container>
                <Comment.Group minimal>
                    <div className="comment-block">
                        <AutoForm ref='comment' schema={schema} onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <img className="md-avatar img-circle"
                                     src={path ? getImagePath(path) : 'https://www.dontshake.org/media/k2/items/cache/71f67488b0857639cee631943a3fc6fa_XL.jpg'}
                                     alt=""/>
                                <AutoField style={{"width": "80%"}} placeholder="Leave your comment" name="content"/>
                                <ErrorField name="content"/>
                                <button className="btn-post">Post</button>
                            </div>
                        </AutoForm>
                    </div>
                    {
                        data &&
                        data.map((comment, index) => {
                            return <CommentSingle comment={comment} key={index}/>
                        })
                    }
                    <Divider/>
                </Comment.Group>
            </Container>
        );
    }
}

const schema = new SimpleSchema({
    content: {
        type: String,
        optional: true,
        label: false
    }
});