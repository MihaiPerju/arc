import React from 'react';
import Loading from "/imports/client/lib/ui/Loading.jsx";
import FacilityRow from "./FacilityRow.jsx";
import FacilityHeadList from "./FacilityHeadList";
import {Container} from 'semantic-ui-react'
import {Table, Icon, Button} from 'semantic-ui-react'
import NoDataFoundCell from '/imports/client/lib/NoDataFoundCell'

export default class FacilityList extends React.Component {
    render() {
        const {data, loading, error, handleHeaderClick, sortBy, isSortAscend} = this.props;
        const clientId = FlowRouter.current().params._id;

        if (loading) {
            return <Loading/>;
        }

        if (error) {
            return <div>Error: {error.reason}</div>;
        }

        return (
            <Table>
                <Table.Header>
                    <FacilityHeadList sortBy={sortBy}
                                        isSortAscend={isSortAscend}
                                        handleHeaderClick={handleHeaderClick}/>
                </Table.Header>
                <Table.Body>
                    {!data.length
                        ? <NoDataFoundCell colSpan="100"/>
                        : data.map(facility => (
                            <FacilityRow key={facility._id} facility={facility}/>
                        ))
                    }
                </Table.Body>
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan='100'>
                        <Button floated='left' icon labelPosition='left' primary size='small'
                            onClick={() => {
                                FlowRouter.go("facility.create", {_id: clientId})
                            }}>
                            <Icon name='plus' /> Create
                        </Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        );
    }
}