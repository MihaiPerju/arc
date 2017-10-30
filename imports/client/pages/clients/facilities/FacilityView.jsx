import React from 'react';
import FacilityDetails from './FacilityDetails';
import tabsEnum from './enums/facility';
import TabSelect from '/imports/client/lib/TabSelect';
import UploadInventoryFile from './components/UploadInventoryFile';
import Loading from "/imports/client/lib/ui/Loading.jsx";

export default class FacilityView extends React.Component {
    constructor() {
        super();


        this.state = {
            activeTab: 0,
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

    onChangeActiveTab(activeTab) {
        this.setState({
            activeTab
        })
    }

    render() {
        const {activeTab, loading, facility} = this.state;
        const tabOptions = [
            {
                label: tabsEnum.VIEW,
                component: <FacilityDetails submitAction={this.updateFacility}/>
            },
            {
                label: tabsEnum.INVENTORY_FILE,
                component: <UploadInventoryFile facilityId={facility && facility._id}/>
            }
        ];

        if (loading) {
            return <Loading/>;
        }

        return (
            <div>
                <TabSelect onChangeActiveTab={this.onChangeActiveTab.bind(this)} options={tabOptions}/>
                {
                    (tabOptions[activeTab].component)
                }
            </div>
        )
    }
}