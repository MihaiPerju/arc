import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/clients/queries/listClients.js';
import ClientList from './components/ClientList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import SearchInput from "/imports/client/lib/SearchInput.jsx";

export default class ClientListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 3,
            filters: {},
            sortBy: 'none',
            isSortAscend: true
        });

        this.query = query.clone();
        this.ClientListCont = createQueryContainer(this.query, ClientList, {
            reactive: false
        })
    }

    handleSearch = (searchValue) => {
        this.updateFilters({
            filters: {
                clientName: {
                    '$regex': searchValue,
                    '$options': 'i'
                }
            }
        })
    };

    handleHeaderClick = (headerName) => {
        const {sortBy, isSortAscend} = this.state;
        if (sortBy === headerName) {
            this.setState({
                isSortAscend: !isSortAscend
            }, this.handleSort);
        } else {
            this.setState({
                sortBy: headerName,
                isSortAscend: true
            }, this.handleSort);
        }
    };

    handleSort = () => {
        const {sortBy, isSortAscend} = this.state;

        this.updateFilters({
            options: {
                sort: {
                    [sortBy]: isSortAscend ? 1 : -1
                }
            }
        });
    };

    render() {
        const params = _.extend({}, this.getPagerOptions());
        const ClientListCont = this.ClientListCont;
        const {sortBy, isSortAscend} = this.state;

        return (
            <div>
                <div>
                    <SearchInput handleSearch={this.handleSearch}/>
                    <h2>Clients</h2>
                </div>
                <div>
                    {this.getPaginator()}
                    <ClientListCont params={params}
                                    sortBy={sortBy}
                                    isSortAscend={isSortAscend}
                                    handleHeaderClick={this.handleHeaderClick}/>
                    {this.getPaginator()}
                </div>
                <div>
                    <a href="/client/create">Create client</a>
                </div>
            </div>
        );
    }
}