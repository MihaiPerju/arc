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
            edit: false
        }
    }

    componentWillReceiveProps() {
        this.setState({edit: false});
    }

    setEdit = () => {
        const {edit} = this.state;
        this.setState({edit: !edit})
    };

    render() {
        const {facility} = this.props;
        console.log(facility)
        const {edit} = this.state;
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
                            <FacilityContentHeader onEdit={this.setEdit} facility={facility}/>
                            <ContactTable contacts={facility && facility.contacts}/>
                            <FacilityFiles facilityId={facility && facility._id}/>
                            <PlacementBlock facility={facility}/>
                            <InventoryBlock facility={facility}/>
                            <PaymentBlock facility={facility}/>
                        </div>
                }

            </div>
        )
    }
}