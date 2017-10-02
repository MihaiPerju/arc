import React from 'react';
import { AutoForm, AutoField, ErrorField, LongTextField } from 'uniforms-unstyled';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';
import { createQueryContainer } from 'meteor/cultofcoders:grapher-react';
import query from '/imports/api/posts/queries/postList';

class EditPost extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit(formData) {
        const {data} = this.props;

        Meteor.call('post.edit', data._id,  formData, (err)=> {
            if (!err) {
                Notifier.success('Data saved !');
                FlowRouter.go('/post/list');
            }
        });
    }

    render() {
        const {data, loading, error} = this.props;

        return (
            <AutoForm schema={CreatePostSchema} onSubmit={this.onSubmit.bind(this)} ref="form" model={data}>
                {this.state.error
                    ? <div className="error">{this.state.error}</div>
                    : ''
                }

                <AutoField name="title"/>
                <ErrorField name="title"/>

                <LongTextField name="content"/>
                <ErrorField name="content"/>

                <button type="submit">
                    Save
                </button>
            </AutoForm>
        )
    }
}

const CreatePostSchema = new SimpleSchema({
    title: {type: String},
    content: {type: String}
});


export default (props) => {
    const Container = createQueryContainer(query.clone({filters: {_id: FlowRouter.current().params.postId}}), EditPost, {
        single: true
    });

    return <Container />
};