import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import query from '/imports/api/letterTemplates/queries/listLetterTemplates.js';
import LetterTemplatesList from './components/LetterTemplatesList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'

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
                    <h2>Letter templates</h2>
                </div>
                <div>
                    {this.getPaginator()}
                    <LetterTemplatesListCont params={params}/>
                    {this.getPaginator()}
                </div>
                <div>
                    <Button primary fluid href="/letter-template/create">Create a letter template</Button>
                </div>
            </Container>
        );
    }
}