import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/reasonCodes/queries/reasonCodesList';
import ReasonCodesList from './components/ReasonCodesList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'

export default class ReasonCodesContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 3,
            filters: {}
        });

        this.query = query.clone();
        this.ReasonCodesListCont = createQueryContainer(this.query, ReasonCodesList, {
            reactive: true
        })
    }

    render() {
        const params = _.extend({}, this.getPagerOptions());
        const ReasonCodesListCont = this.ReasonCodesListCont;

        return (
            <Container className="page-container">
                <div>
                    <Header as="h2" textAlign="center">Reason Codes</Header>
                </div>
                <div>
                    {this.getPaginator()}
                    <ReasonCodesListCont params={params}/>
                    {this.getPaginator()}
                </div>
                <Divider/>
                <Button fluid primary href="/reason-code/create">Create Reason Code</Button>
            </Container>
        );
    }
}