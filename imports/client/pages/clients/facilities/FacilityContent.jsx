import React, {Component} from 'react';
import FacilityContentHeader from './components/FacilityContent/FacilityContentHeader';
import PlacementBlock from './components/FacilityContent/PlacementBlock';
import InventoryBlock from './components/FacilityContent/InventoryBlock';
import PaymentBlock from './components/FacilityContent/PaymentBlock';

export default class FacilityContent extends Component {
    render() {
        return (
            <div className="main-content facility-content">
                <div className="breadcrumb">
                    <ul>
                        <li>
                            <a href={FlowRouter.url('/client/list')}>Millenium Insurance</a>
                        </li>
                        <li>
                            <span>Facillity name 1</span>
                        </li>
                    </ul>
                </div>
                <FacilityContentHeader/>
                <PlacementBlock/>
                <InventoryBlock/>
                <PaymentBlock/>
            </div>
        )
    }
}