import React from 'react';
import {AutoForm, AutoField, ErrorField, LongTextField} from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'

class CreatePost extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit(data) {
        Meteor.call('post.create', data, (err) => {
            if (!err) {
                Notifier.success('Post created !');
                FlowRouter.go('/post/list');
            }
        });
    }

    render() {
        return (
            <Container className="page-container">
                <AutoForm schema={CreatePostSchema} onSubmit={this.onSubmit.bind(this)} ref="form">
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
                        Add
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

export default CreatePost;