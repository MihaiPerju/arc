import React, {Component} from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/posts/queries/postList';
import PostList from './components/PostList.jsx';
import { createQueryContainer } from 'meteor/cultofcoders:grapher-react';

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
            <div>
                <div>
                    <h2>Posts</h2>
                </div>
                <div>
                    {this.getPaginator()}
                    <PostListCont params={params}/>
                    {this.getPaginator()}
                </div>
                <div>
                    <a href="/post/create">Create post</a>
                </div>
            </div>
        );
    }
}