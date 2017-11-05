import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/letterTemplates/queries/listLetterTemplates.js';
import LetterTemplatesList from './components/LetterTemplatesList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'

export default class LetterTemplatesListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 3,
            filters: {}
        });

        this.query = query.clone();
        this.LetterTemplatesListCont = createQueryContainer(this.query, LetterTemplatesList, {
            reactive: false
        })
    }

    render() {
        const params = _.extend({}, this.getPagerOptions());
        const LetterTemplatesListCont = this.LetterTemplatesListCont;

        return (
            <Container>
                <div>
                    <Header as="h2" textAlign="center">Letter templates</Header>
                </div>
                <div>
                    {this.getPaginator()}
                    <LetterTemplatesListCont params={params}/>
                    {this.getPaginator()}
                </div>
                <Divider/>
                <Button primary fluid href="/letter-template/create">Create a letter template</Button>
            </Container>
        );
    }
}