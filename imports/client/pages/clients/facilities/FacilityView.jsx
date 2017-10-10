import React from 'react';
import Notifier from '/imports/client/lib/Notifier';
import Loading from "/imports/client/lib/ui/Loading.jsx";

export default class FacilityView extends React.Component {
    constructor() {
        super();

        this.state = {
            facility: null,
            loading: true
        }
    }

    componentDidMount() {
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
    }

    render() {
        const {loading, facility} = this.state;

        if(loading) {
            return <Loading/>;
        }

        console.log(facility)

        return (
            <div>
                facilityView
            </div>
        );
    }
}