import React, {Component} from 'react';
import _ from 'underscore';
import CodeSingle from './CodeSingle.jsx';
import CodeHeadList from './CodeHeadList';
import {Container} from 'semantic-ui-react'
import {Table} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'

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
            <Container>
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
                </Table>
            </Container>
        );
    }
}