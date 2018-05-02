import React from 'react';
import Loading from '/imports/client/lib/ui/Loading.jsx';
import LetterRow from './LetterRow.jsx';
import {Container, Table} from 'semantic-ui-react';
import NoDataFoundCell from '/imports/client/lib/NoDataFoundCell'

export default class LetterList extends React.Component {
    render() {
        const {data, loading, error} = this.props;

        if (loading) {
            return <Loading/>;
        }

        if (error) {
            return <div>Error: {error.reason}</div>;
        }

        return (
            <Container>
                <Table>
                    <Table.Header>
                        <tr>
                            <th>Letter ID</th>
                            <th>Status</th>
                            <th>Create at</th>
                            <th>Actions</th>
                        </tr>
                    </Table.Header>
                    <Table.Body>
                        {!data.length
                            ? <NoDataFoundCell colSpan="100"/>
                            : data.map(letter => (
                                <LetterRow key={letter._id}
                                           letter={letter}/>
                            ))
                        }
                    </Table.Body>
                </Table>

            </Container>
        );
    }
}