import React, {Component} from 'react';
import FacilityContentHeader from './components/FacilityContent/FacilityContentHeader';
import PlacementBlock from './components/FacilityContent/PlacementBlock';
import InventoryBlock from './components/FacilityContent/InventoryBlock';
import PaymentBlock from './components/FacilityContent/PaymentBlock';

export default class FacilityContent extends Component {
    render() {
        const {facility} = this.props;
        console.log(facility);
        return (
            <div className="main-content facility-content">
                <div className="breadcrumb">
                    <ul>
                        <li>
                            <a href={FlowRouter.url('/client/list')}>Clients</a>
                        </li>
                        <li>
                            <span>{facility.name}</span>
                        </li>
                    </ul>
                </div>
                <FacilityContentHeader facility={facility}/>
                <PlacementBlock facility={facility}/>
                <InventoryBlock facility={facility}/>
                <PaymentBlock facility={facility}/>
            </div>
        )
    }
}