import React, {Component} from 'react';
import CommentSingle from './CommentSingle.jsx';
import {Container} from 'semantic-ui-react'
import Loading from '/imports/client/lib/ui/Loading';
import {Comment, Divider, Header} from 'semantic-ui-react'
import autoBind from 'react-autobind';
import Notifier from '/imports/client/lib/Notifier';
import {AutoForm, AutoField, ErrorField, SelectField} from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';

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

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }


        return (
            <Container>
                <Comment.Group minimal>
                    <Header as='h3' dividing>Comments</Header>
                    {
                        data.map((comment, index) => {
                            return <CommentSingle comment={comment} key={index}/>
                        })
                    }

                    <AutoForm ref='comment' schema={schema} onSubmit={this.onSubmit}>
                        <AutoField name="content"/>
                        <ErrorField name="content"/>
                    </AutoForm>

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
        label: 'Comment'
    }
});