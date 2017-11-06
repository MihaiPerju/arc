import React from 'react';
import {AutoForm, AutoField, ErrorField, LongTextField} from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import query from '/imports/api/posts/queries/postList';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'

class EditPost extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit(formData) {
        const {data} = this.props;

        Meteor.call('post.edit', data._id, formData, (err) => {
            if (!err) {
                Notifier.success('Data saved !');
                FlowRouter.go('/post/list');
            }
        });
    }

    render() {
        const {data, loading, error} = this.props;

        return (
            <Container className="page-container">
                <AutoForm schema={CreatePostSchema} onSubmit={this.onSubmit.bind(this)} ref="form" model={data}>
                    {this.state.error
                        ? <div className="error">{this.state.error}</div>
                        : ''
                    }

                    <AutoField name="title"/>
                    <ErrorField name="title"/>

                    <LongTextField name="content"/>
                    <ErrorField name="content"/>

                    <Divider/>

                    <Button primary fluid type="submit">
                        Save
                    </Button>
                </AutoForm>
            </Container>
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

    return <Container/>
};