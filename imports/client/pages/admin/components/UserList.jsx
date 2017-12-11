import React, {Component} from 'react';
import _ from 'underscore';
import UserSingle from './UserSingle.jsx';
import {Table, Icon, Button} from 'semantic-ui-react'

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
            <Table striped>
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
                <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell colSpan='100'>
                            <Button href="/admin/user/create" floated='left' icon labelPosition='left' primary size='small'>
                                <Icon name='plus' /> Create
                            </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                </Table.Footer>
            </Table>
        );
    }
}