import React, {Component} from 'react';
import FacilityContentHeader from './components/FacilityContent/FacilityContentHeader';
import ContactTable from './components/FacilityContent/ContactTable';
import FacilityFiles from './components/FacilityContent/FacilityFiles';
import PlacementBlock from './components/FacilityContent/PlacementBlock';
import InventoryBlock from './components/FacilityContent/InventoryBlock';
import PaymentBlock from './components/FacilityContent/PaymentBlock';
import FacilityEdit from '/imports/client/pages/clients/facilities/FacilityEdit.jsx';

export default class FacilityContent extends Component {
    constructor() {
        super();
        this.state = {
            edit: false,
            tempPlacementRules: {},
            inventoryFacility: null
        }
    }

    componentWillMount() {
        const {facility} = this.props;
        const {placementRules} = facility;
        this.setState({tempPlacementRules: placementRules, inventoryFacility: facility});
    }

    componentWillReceiveProps() {
        this.setState({edit: false});
    }

    setEdit = () => {
        const {edit} = this.state;
        this.setState({edit: !edit})
    };

    setTempRules = (model) => {
        this.setState({tempPlacementRules: model});
    };

    copyPlacementRules = () => {
        const {tempPlacementRules} = this.state;
        const {facility} = this.props;
        const temp = _.clone(facility);
        temp.inventoryRules = {};
        temp.inventoryRules = tempPlacementRules;
        this.setState({inventoryFacility: temp})
    }

    render() {
        const {facility, setFacility} = this.props;
        const {edit, inventoryFacility} = this.state;
        return (
            <div className="main-content facility-content">
                <div className="breadcrumb">
                    <ul>
                        <li>
                            <a href={FlowRouter.url('/client/list')}>Clients</a>
                        </li>
                        <li>
                            <a style={{pointerEvents: 'none', cursor: 'default'}}>{facility.client.clientName}</a>
                        </li>
                        <li>
                            <span>{facility.name}</span>
                        </li>
                    </ul>
                </div>
                {
                    edit ? <FacilityEdit facility={facility} close={this.setEdit}/> :
                        <div>
                            <FacilityContentHeader onEdit={this.setEdit} setFacility={setFacility} facility={facility}/>
                            <ContactTable contacts={facility && facility.contacts}/>
                            <FacilityFiles facilityId={facility && facility._id}/>
                            <PlacementBlock facility={facility} setTempRules={this.setTempRules}/>
                            <InventoryBlock facility={inventoryFacility} copyPlacementRules={this.copyPlacementRules}/>
                            <PaymentBlock facility={facility}/>
                        </div>
                }

            </div>
        )
    }
}