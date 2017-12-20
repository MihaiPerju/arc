import React, {Component} from 'react';
import _ from 'underscore';
import RegionSingle from './RegionSingle.jsx';
import {Button} from 'semantic-ui-react'
import {Container, Icon} from 'semantic-ui-react'
import {Table} from 'semantic-ui-react'
import NoDataFoundCell from '/imports/client/lib/NoDataFoundCell'

export default class RegionsList extends Component {
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

                                {_.map(data, (region, idx) => {
                                    return <RegionSingle region={region} key={idx}/>;

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
                            <Button href='/region/create' floated='left' icon labelPosition='left' primary size='small'>
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