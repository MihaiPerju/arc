import React from 'react';
import Notifier from '/imports/client/lib/Notifier';
import Loading from "/imports/client/lib/ui/Loading.jsx";
import FacilityForm from "./components/FacilityForm.jsx";
import TabSelect from '/imports/client/lib/TabSelect';
import tabsEnum from '/imports/client/pages/clients/facilities/enums/facility';
import ImportingRules from '/imports/client/pages/clients/facilities/components/ImportingRules';
import UploadPlacementFile from '/imports/client/pages/clients/facilities/components/UploadPlacementFile';
import {Container} from 'semantic-ui-react'

export default class FacilityEdit extends React.Component {
    constructor() {
        super();

        this.state = {
            facility: null,
            loading: true
        };

    }

    componentDidMount() {
        this.getFacility();
    }

    getFacility = () => {
        const {facilityId} = FlowRouter.current().params;
        Meteor.call('facility.get', facilityId, (err, facility) => {
            if (err) {
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
            if (err) {
                return Notifier.error('Error while updating facility!');
            }

            Notifier.success('Facility updated!');
            this.getFacility();
        })
    };

    render() {
        const {loading, facility} = this.state;
        const tabOptions = [
            {
                label: tabsEnum.GENERAL,
                component: <FacilityForm model={facility} submitAction={this.updateFacility}/>


            },
            {
                label: tabsEnum.IMP_RULES,
                component: <ImportingRules model={facility}/>
            },
            {
                label: tabsEnum.PLACEMENT_FILE,
                component: <UploadPlacementFile facilityId={facility && facility._id}/>
            }
        ];

        if (loading) {
            return <Loading/>;
        }

        return (
            <Container>
                <TabSelect header="Edit facility" options={tabOptions}/>
            </Container>
        );
    }
}