import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/insuranceCompanies/queries/insuranceCompanyList.js';
import InsuranceCompaniesList from './components/InsuranceCompaniesList.jsx';
import { createQueryContainer } from 'meteor/cultofcoders:grapher-react';
import { Container } from 'semantic-ui-react';
import { Header } from 'semantic-ui-react';


export default class InsuranceCompaniesListContainer extends Pager {
    constructor () {
        super();

        _.extend(this.state, {
            perPage: 3,
            filters: {}
        });

        this.query = query.clone();
        this.InsuranceCompaniesListCont = createQueryContainer(this.query, InsuranceCompaniesList, {
            reactive: false
        });
    }

    render () {
        const params = _.extend({}, this.getPagerOptions());
        const InsuranceCompaniesListCont = this.InsuranceCompaniesListCont;

        return (
            <Container className="page-container">
                <div>
                    <Header as="h2" textAlign="center">Insurance Companies</Header>
                </div>
                <div>
                    {this.getPaginator()}
                    <InsuranceCompaniesListCont params={params}/>
                    {this.getPaginator()}
                </div>
            </Container>
        );
    }
}