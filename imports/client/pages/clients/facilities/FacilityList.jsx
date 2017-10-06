import React from 'react';

export default class FacilityList extends React.Component {
    render() {
        return (
            <div>
                <h3>Facility List</h3>
                <button onClick={() => {
                    //TODO
                    FlowRouter.go("facility.create", {_id: 'clientId', facilityId: 'facility'})
                }}>
                    Create
                </button>
            </div>
        );
    }
}