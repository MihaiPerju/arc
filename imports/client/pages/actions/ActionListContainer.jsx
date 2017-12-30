import React, { Component } from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/actions/queries/actionList';
import ActionList from './components/ActionList.jsx';
import { createQueryContainer } from 'meteor/cultofcoders:grapher-react';
import SearchInput from "/imports/client/lib/SearchInput.jsx";
import {Container} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'

export default class ActionListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 3,
            filters: {},
        });

        this.query = query.clone();
        this.ActionListCont = createQueryContainer(this.query, ActionList, {
            reactive: false
        })
    }

    handleSearch = (searchValue) => {
        this.updateFilters({
            filters: {
                title: {
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
        const ActionListCont = this.ActionListCont;
        const {sortBy, isSortAscend} = this.state;

        return (
            <Container className="page-container">
                <div>
                    <Header as="h2" textAlign="center">Actions</Header>
                    <SearchInput handleSearch={this.handleSearch}/>                    
                </div>
                <div className='m-t-30'>
                    {this.getPaginator()}
                    <ActionListCont params={params}
                                    handleHeaderClick={this.handleHeaderClick}/>
                    {this.getPaginator()}
                </div>            
            </Container>
        );
    }
}
