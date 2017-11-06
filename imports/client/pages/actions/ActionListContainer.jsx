import React, { Component } from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/actions/queries/actionList';
import ActionList from './components/ActionList.jsx';
import { createQueryContainer } from 'meteor/cultofcoders:grapher-react';

export default class ActionListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 10,
            filters: {}
        });

        this.query = query.clone();
        this.ActionListCont = createQueryContainer(this.query, ActionList, {
            reactive: false
        })
    }

    render() {
        const params = _.extend({}, this.getPagerOptions());
        const ActionListCont = this.ActionListCont;

        return (
            <div>
                <div>
                    <h2>Actions</h2>
                </div>
                <div>
                    {this.getPaginator()}
                    <ActionListCont params={params}/>
                    {this.getPaginator()}
                </div>
                <div>
                    <a href="/action/create">Create action</a>
                </div>
            </div>
        );
    }
}