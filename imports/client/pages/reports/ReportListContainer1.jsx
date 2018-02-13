import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/reports/queries/reportsList';
import ReportList from './components/ReportList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'
import SearchInput from "/imports/client/lib/SearchInput.jsx";
import PageConfig from '/imports/client/business';

export default class ReportListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: PageConfig.defaultPerPage,
            filters: {}
        });

        this.query = query.clone();
        this.ReportListCont = createQueryContainer(this.query, ReportList, {
            reactive: false
        })
    }

    handleSearch = (searchValue) => {
        this.updateFilters({
            filters: {
                name: {
                    '$regex': searchValue,
                    '$options': 'i'
                }
            }
        })
    };

    render() {
        const params = _.extend({}, this.getPagerOptions());
        const ReportListCont = this.ReportListCont;
        const {total} = this.state;

        return (

            <Container className="page-container">
                <div>
                    <SearchInput handleSearch={this.handleSearch}/>
                    <Header as="h2" textAlign="center">Custom reports</Header></div>
                <div>
                    {
                        total > PageConfig.defaultPerPage
                        &&
                        this.getPaginator()
                    }
                    <ReportListCont params={params}/>
                    {
                        total > PageConfig.defaultPerPage
                        &&
                        this.getPaginator()
                    }
                </div>
            </Container>

        );
    }
}