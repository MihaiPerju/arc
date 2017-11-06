import React, {Component} from 'react';
import _ from 'underscore';
import ActionSingle from './ActionSingle.jsx';
import ActionHeadList from './ActionHeadList';
import {Container} from 'semantic-ui-react'
import {Table} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'

export default class ActionList extends Component {
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
                        <ActionHeadList sortBy={sortBy}
                                        isSortAscend={isSortAscend}
                                        handleHeaderClick={handleHeaderClick}/>
                    </Table.Header>
                    {
                        data.length
                            ?
                            <Table.Body>

                                {_.map(data, (action, idx) => {
                                    return <ActionSingle action={action} key={idx}/>;
                                })}
                            </Table.Body>
                            :
                            <Table.Body>
                                There are no actions
                            </Table.Body>
                    }
                </Table>
            </Container>
            
        );
    }
}
