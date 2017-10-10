import React from 'react';
import Notifier from '/imports/client/lib/Notifier';

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
            <tr>
                <td>{facility.name}</td>
                <td>{facility.state}</td>
                <td>{facility.region}</td>
                <td>{facility.addressOne && facility.addressTwo}</td>
                <td>{facility.status}</td>
                <td>
                    <button
                        onClick={() => (
                            FlowRouter.go("facility.view", {_id: facility.clientId, facilityId: facility._id})
                        )}>
                        View
                    </button>
                    <button
                        onClick={() => (
                            FlowRouter.go("facility.edit", {_id: facility.clientId, facilityId: facility._id})
                        )}>
                        Edit
                    </button>

                    <button onClick={() => (this.handleDelete(facility._id))}>Delete</button>
                </td>
            </tr>
        );
    }
}