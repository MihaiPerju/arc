import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/regions/queries/regionList.js';
import RegionsList from './components/RegionsList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'

export default class RegionsListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 3,
            filters: {}
        });

        this.query = query.clone();
        this.RegionsListCont = createQueryContainer(this.query, RegionsList, {
            reactive: false
        })
    }

    render() {
        const params = _.extend({}, this.getPagerOptions());
        const RegionsListCont = this.RegionsListCont;

        return (
            <Container className="page-container">
                <div>
                    <Header as="h2" textAlign="center">Regions</Header>
                </div>
                <div>
                    {this.getPaginator()}
                    <RegionsListCont params={params}/>
                    {this.getPaginator()}
                </div>
                <Divider/>
                <Button primary fluid href="/region/create">Create a region</Button>
            </Container>
        );
    }
}