import React, {Component} from 'react';
import _ from 'underscore';
import ClientSingle from './ClientSingle.jsx';
import ClientHeadList from './ClientHeadList';
import {Container} from 'semantic-ui-react'
import {Table} from 'semantic-ui-react'

export default class ClientList extends Component {
    render() {
        const {data, loading, error, handleHeaderClick, sortBy, isSortAscend} = this.props;

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
                        <ClientHeadList sortBy={sortBy}
                                        isSortAscend={isSortAscend}
                                        handleHeaderClick={handleHeaderClick}/>
                    </Table.Header>
                    {
                        data.length
                            ?
                            <Table.Body>

                                {_.map(data, (client, idx) => {
                                    return <ClientSingle client={client} key={idx}/>;
                                })}
                            </Table.Body>
                            :
                            <Table.Body>
                                There are no clients
                            </Table.Body>
                    }
                </Table>
            </Container>
        );
    }
}