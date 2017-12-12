import React, {Component} from 'react';
import _ from 'underscore';
import ReportSingle from './ReportSingle.jsx';
import {Table} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'

export default class ReportList extends Component {
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
                    <Table.Body>
                        {_.map(data, (report) => {
                            return <ReportSingle report={report} key={report._id}/>;
                        })}
                    </Table.Body>
                </Table>
            </Container>
        );
    }
}