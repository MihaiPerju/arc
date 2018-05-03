import React from 'react';
import Notifier from '/imports/client/lib/Notifier';
import {Table} from 'semantic-ui-react';
import {Button, Dropdown} from 'semantic-ui-react';

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

                    <Dropdown button text='Action' icon={null} simple>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Button
                                        primary
                                        onClick={() => (
                                            FlowRouter.go("facility.view", {_id: facility.clientId, facilityId: facility._id})
                                        )}>
                                        View
                                </Button>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Button
                                    onClick={() => (
                                        FlowRouter.go("facility.edit", {_id: facility.clientId, facilityId: facility._id})
                                    )}>
                                    Edit
                                </Button>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Button color="green"
                                    onClick={() => (
                                        FlowRouter.go("report.create.facilityid", {facilityId: facility._id})
                                    )}>
                                    Create Report
                                </Button>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Button color="red" onClick={() => (this.handleDelete(facility._id))}>Delete</Button>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                </Table.Cell>
            </Table.Row>
        );
    }
}