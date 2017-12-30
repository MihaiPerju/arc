import React, {Component} from 'react';
import _ from 'underscore';
import ReportSingle from './ReportSingle.jsx';
import {Table} from 'semantic-ui-react'
import {Container, Button, Icon} from 'semantic-ui-react'
import NoDataFoundCell from '/imports/client/lib/NoDataFoundCell'

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
            <Container className="m-t-30">
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
                                {_.map(data, (report) => {
                                    return <ReportSingle report={report} key={report._id}/>;
                                })}
                            </Table.Body>
                            :
                            <Table.Body>
                                <NoDataFoundCell colSpan="100"/>
                            </Table.Body>
                    }
                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell colSpan='100'>
                            <Button href='report/create' floated='left' icon labelPosition='left' primary size='small'>
                                <Icon name='plus' /> Create
                            </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </Container>
        );
    }
}
