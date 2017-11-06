import React from 'react';
import Loading from "/imports/client/lib/ui/Loading.jsx";
import FacilityRow from "./FacilityRow.jsx";
import FacilityHeadList from "./FacilityHeadList";
import {Container} from 'semantic-ui-react'
import {Table} from 'semantic-ui-react'

export default class FacilityList extends React.Component {
    render() {
        const {data, loading, error, handleHeaderClick, sortBy, isSortAscend} = this.props;

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
                        <FacilityHeadList sortBy={sortBy}
                                          isSortAscend={isSortAscend}
                                          handleHeaderClick={handleHeaderClick}/>
                    </Table.Header>
                    <Table.Body>
                        {!data.length
                            ? <p>There are no facilities</p>
                            :
                            data.map(facility => (
                                <FacilityRow key={facility._id} facility={facility}/>
                            ))
                        }
                    </Table.Body>
                </Table>

            </Container>
        );
    }
}