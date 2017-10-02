import React from 'react';
import { AutoForm, AutoField, ErrorField, LongTextField } from 'uniforms-unstyled';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';

class CreatePost extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit(data) {
        Meteor.call('post.create', data, (err)=> {
            if (!err) {
                Notifier.success('Post created !');
                FlowRouter.go('/post/list');
            }
        });
    }

    render() {
        return (
            <AutoForm schema={CreatePostSchema} onSubmit={this.onSubmit.bind(this)} ref="form">
                {this.state.error
                    ? <div className="error">{this.state.error}</div>
                    : ''
                }

                <AutoField name="title"/>
                <ErrorField name="title"/>

                <LongTextField name="content"/>
                <ErrorField name="content"/>

                <button type="submit">
                    Add
                </button>
            </AutoForm>
        )
    }
}

const CreatePostSchema = new SimpleSchema({
    title: {type: String},
    content: {type: String}
});

export default CreatePost;