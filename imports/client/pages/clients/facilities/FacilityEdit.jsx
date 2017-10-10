import React from 'react';
import Notifier from '/imports/client/lib/Notifier';
import Loading from "/imports/client/lib/ui/Loading.jsx";
import FacilityForm from "./components/FacilityForm.jsx";

export default class FacilityEdit extends React.Component {
    constructor() {
        super();

        this.state = {
            facility: null,
            loading: true
        }
    }

    componentDidMount() {
        this.getFacility();
    }

    getFacility = () => {
        const {facilityId} = FlowRouter.current().params;
        Meteor.call('facility.get', facilityId, (err, facility) => {
            if(err) {
                return Notifier.error('Error while getting facility!');
            }

            this.setState({
                facility,
                loading: false
            })
        })
    };

    updateFacility = (data) => {
        Meteor.call('facility.update', data, (err) => {
            if(err) {
                return Notifier.error('Error while updating facility!');
            }

            Notifier.success('Facility updated!');
            this.getFacility();
        })
    };

    render() {
        const {loading, facility} = this.state;

        if(loading) {
            return <Loading/>;
        }

        return (
            <div>
                <h3>Edit facility</h3>
                <FacilityForm model={facility} submitAction={this.updateFacility} />
            </div>
        );
    }
}