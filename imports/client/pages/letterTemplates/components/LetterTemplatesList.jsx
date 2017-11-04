import React, {Component} from 'react';
import _ from 'underscore';
import LetterTemplateSingle from './LetterTemplateSingle.jsx';
import {Button} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import {Table} from 'semantic-ui-react'

export default class LetterTemplateList extends Component {
    render() {
        const {data, loading, error} = this.props;

        if (loading) {
            return <div>Loading</div>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }

        return (
            <Container>
                <Table padded>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    {
                        data.length
                            ?
                            <Table.Body>

                                {_.map(data, (letterTemplate, idx) => {
                                    return <LetterTemplateSingle letterTemplate={letterTemplate} key={idx}/>;
                                })}
                            </Table.Body>
                            :
                            <Table.Body>
                                There are no letter templates
                            </Table.Body>
                    }
                </Table>
            </Container>
        );
    }
}