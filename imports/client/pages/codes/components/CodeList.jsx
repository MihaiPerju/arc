import React, {Component} from 'react';
import _ from 'underscore';
import CodeSingle from './CodeSingle.jsx';
import CodeHeadList from './CodeHeadList';
import {Button, Icon, Table, Container} from 'semantic-ui-react'

export default class CodeList extends Component {
    render() {
        const {data, loading, error, handleHeaderClick, sortBy, isSortAscend} = this.props;

        if (loading) {
            return <div>Loading</div>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }

        return (
            <Table>
                <Table.Header>
                    <CodeHeadList sortBy={sortBy}
                                    isSortAscend={isSortAscend}
                                    handleHeaderClick={handleHeaderClick}/>
                </Table.Header>
                {
                    data.length
                        ?
                        <Table.Body>

                            {_.map(data, (code, idx) => {
                                return <CodeSingle code={code} key={idx}/>;
                            })}
                        </Table.Body>
                        :
                        <Table.Body>
                            There are no CARC/RARC codes.
                        </Table.Body>
                }
                <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell colSpan='100'>
                            <Button href='/code/create' floated='left' icon labelPosition='left' primary size='small'>
                                <Icon name='plus' /> Create
                            </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                </Table.Footer>
            </Table>
        
        );
    }
}