import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/posts/queries/postList';
import PostList from './components/PostList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'

export default class PostListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 3,
            filters: {}
        });

        this.query = query.clone();
        this.PostListCont = createQueryContainer(this.query, PostList, {
            reactive: false
        })
    }

    render() {
        const params = _.extend({}, this.getPagerOptions());
        const PostListCont = this.PostListCont;

        return (
            <Container className="page-container">
                <div>
                    <Header as="h2" textAlign="center">Posts</Header>
                </div>
                <div>
                    {this.getPaginator()}
                    <PostListCont params={params}/>
                    {this.getPaginator()}
                </div>
                <Divider/>
                <Button fluid primary href="/post/create">Create post</Button>
            </Container>
        );
    }
}