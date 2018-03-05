import React, {Component} from 'react';
import _ from 'underscore';
import ReasonCodeSingle from './ReasonCodeSingle.jsx';
import {Table} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import NoDataFoundCell from '/imports/client/lib/NoDataFoundCell'

export default class ReasonCodesList extends Component {
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
                            <Table.HeaderCell>Reason</Table.HeaderCell>
                            <Table.HeaderCell>State</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    {
                        data.length
                            ?
                            <Table.Body>
                                {_.map(data, (reasonCode) => {
                                    return <ReasonCodeSingle reasonCode={reasonCode} key={reasonCode._id}/>;
                                })}
                            </Table.Body>
                            :
                            <Table.Body>
                                <NoDataFoundCell colSpan="100"/>
                            </Table.Body>
                    }
                </Table>
            </Container>
        );
    }
}