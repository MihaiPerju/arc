import React from 'react';
import Notifier from '/imports/client/lib/Notifier';
import {Table} from 'semantic-ui-react';
import {Button} from 'semantic-ui-react';

export default class FacilityRow extends React.Component {
    handleDelete = (facilityId) => {
        Meteor.call('facility.remove', facilityId, (err) => {
            if (err) {
                return Notifier.error("Error while removing facility!")
            }

            Notifier.success('Facility deleted !');
            FlowRouter.reload();
        })
    };

    render() {
        const {facility} = this.props;

        return (
            <Table.Row>
                <Table.Cell>{facility.name}</Table.Cell>
                <Table.Cell>{facility.state}</Table.Cell>
                <Table.Cell>{facility.city}</Table.Cell>
                <Table.Cell>{facility.region}</Table.Cell>
                <Table.Cell>{facility.zipCode}</Table.Cell>
                <Table.Cell>{facility.addressOne}</Table.Cell>
                <Table.Cell>{facility.addressTwo}</Table.Cell>
                <Table.Cell>{facility.status}</Table.Cell>
                <Table.Cell>
                    <Button.Group>
                        <Button
                            primary
                            onClick={() => (
                                FlowRouter.go("facility.view", {_id: facility.clientId, facilityId: facility._id})
                            )}>
                            View
                        </Button>
                        <Button
                            onClick={() => (
                                FlowRouter.go("facility.edit", {_id: facility.clientId, facilityId: facility._id})
                            )}>
                            Edit
                        </Button>

                        <Button color="red" onClick={() => (this.handleDelete(facility._id))}>Delete</Button>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}