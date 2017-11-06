import React, {Component} from 'react';
import _ from 'underscore';
import UserSingle from './UserSingle.jsx';
import {Container} from 'semantic-ui-react'
import {Table} from 'semantic-ui-react'

export default class UserList extends Component {
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
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>

                        {_.map(data, (user, idx) => {
                            return <UserSingle user={user} key={idx}/>;
                        })}
                    </Table.Body>
                </Table>
            </Container>
        );
    }
}