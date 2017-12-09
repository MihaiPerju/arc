import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/reports/queries/reportsList';
import ReportList from './components/ReportList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'

export default class ReportListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 3,
            filters: {}
        });

        this.query = query.clone();
        this.ReportListCont = createQueryContainer(this.query, ReportList, {
            reactive: false
        })
    }

    render() {
        const params = _.extend({}, this.getPagerOptions());
        const ReportListCont = this.ReportListCont;

        return (

            <Container className="page-container">
                <div>
                    <Header as="h2" textAlign="center">Custom reports</Header></div>
                <div>
                    {this.getPaginator()}
                    <ReportListCont params={params}/>
                    {this.getPaginator()}
                </div>
                <Divider/>
                <Button fluid primary href="/report/create">Create report</Button>
            </Container>

        );
    }
}