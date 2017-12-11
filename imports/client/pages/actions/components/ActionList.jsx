import React, {Component} from 'react';
import _ from 'underscore';
import ActionSingle from './ActionSingle.jsx';
import ActionHeadList from './ActionHeadList';
import {Button, Icon, Table, Container} from 'semantic-ui-react'

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
                <Table striped>
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
                        <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell colSpan='100'>
                            <Button href='/action/create' floated='left' icon labelPosition='left' primary size='small'>
                                <Icon name='plus' /> Create
                            </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                        </Table.Footer>
                </Table>
        );
    }
}
