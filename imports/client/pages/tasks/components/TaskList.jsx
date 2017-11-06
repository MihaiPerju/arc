import React, {Component} from 'react';
import _ from 'underscore';
import PostSingle from './PostSingle.jsx';
import {Icon, Label, Menu, Table} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'

export default class PostList extends Component {
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
                            <Table.HeaderCell>Title</Table.HeaderCell>
                            <Table.HeaderCell>Content</Table.HeaderCell>
                            <Table.HeaderCell>User</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {_.map(data, (post) => {
                            return <PostSingle post={post} key={post._id}/>;
                        })}
                    </Table.Body>
                </Table>
            </Container>
        );
    }
}