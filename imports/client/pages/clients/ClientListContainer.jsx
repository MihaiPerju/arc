import React, {Component} from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/clients/queries/listClients.js';
import ClientList from './components/ClientList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';

export default class ClientListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 3,
            filters: {}
        });

        this.query = query.clone();
        this.ClientListCont = createQueryContainer(this.query, ClientList, {
            reactive: false
        })
    }

    render() {
        const params = _.extend({}, this.getPagerOptions());
        const ClientListCont = this.ClientListCont;

        return (
            <div>
                <div>
                    <h2>Clients</h2>
                </div>
                <div>
                    {this.getPaginator()}
                    <ClientListCont params={params}/>
                    {this.getPaginator()}
                </div>
                <div>
                    <a href="/client/create">Create client</a>
                </div>
            </div>
        );
    }
}