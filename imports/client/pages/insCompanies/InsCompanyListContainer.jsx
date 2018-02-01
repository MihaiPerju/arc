import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/insCompanies/queries/insCompanyList.js';
import InsCompaniesList from './components/InsCompaniesList.jsx';
import { createQueryContainer } from 'meteor/cultofcoders:grapher-react';
import { Container } from 'semantic-ui-react';
import { Header } from 'semantic-ui-react';


export default class InsCompaniesListContainer extends Pager {
    constructor () {
        super();

        _.extend(this.state, {
            perPage: 3,
            filters: {}
        });

        this.query = query.clone();
        this.InsCompaniesListCont = createQueryContainer(this.query, InsCompaniesList, {
            reactive: false
        });
    }

    render () {
        const params = _.extend({}, this.getPagerOptions());
        const InsCompaniesListCont = this.InsCompaniesListCont;

        return (
            <Container className="page-container">
                <div>
                    <Header as="h2" textAlign="center">Insurance Companies</Header>
                </div>
                <div>
                    {this.getPaginator()}
                    <InsCompaniesListCont params={params}/>
                    {this.getPaginator()}
                </div>
            </Container>
        );
    }
}