import React, {Component} from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/users/queries/listUsers.js';
import UserList from './components/UserList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {Container} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'

export default class UserListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 3,
            filters: {}
        });

        this.query = query.clone();
        this.UserListCont = createQueryContainer(this.query, UserList, {
            reactive: false
        })
    }

    render() {
        const params = _.extend({}, this.getPagerOptions());
        const UserListCont = this.UserListCont;

        return (
            <Container className="page-container">
                <div>
                    <Header textAlign="center" as="h2">Users</Header>
                </div>
                <div className='m-t-30'>
                    {this.getPaginator()}
                    <UserListCont params={params}/>
                    {this.getPaginator()}
                </div>
            </Container>
        );
    }
}