import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/codes/queries/listCodes.js';
import CodeList from './components/CodeList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import SearchInput from "/imports/client/lib/SearchInput.jsx";
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'

export default class CodeListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 20,
            filters: {},
            sortBy: 'none',
            isSortAscend: true
        });

        this.query = query.clone();
        this.CodeListCont = createQueryContainer(this.query, CodeList, {
            reactive: false
        })
    }

    handleSearch = (searchValue) => {
        this.updateFilters({
            filters: {
                code: {
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
        const CodeListCont = this.CodeListCont;
        const {sortBy, isSortAscend} = this.state;

        return (
            <Container className="page-container">
                <div>
                    <SearchInput handleSearch={this.handleSearch}/>
                    <Header as="h2" textAlign="center">Manage CARC/RARC Codes</Header>
                </div>
                <div>
                    {this.getPaginator()}
                    <CodeListCont params={params}
                                  sortBy={sortBy}
                                  isSortAscend={isSortAscend}
                                  handleHeaderClick={this.handleHeaderClick}/>
                    {this.getPaginator()}
                </div>
                <Divider/>
                <Button primary fluid href="/code/create">Create code</Button>
            </Container>
        );
    }
}