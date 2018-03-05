import React, {Component} from 'react';

export default class FacilityContentHeader extends Component {
    onEditFacility(facility){
        FlowRouter.go('facility.edit',
            {
                _id: FlowRouter.current().params._id,
                facilityId: facility._id
            });
    }
    render() {
        const {facility} = this.props;
        return (
            <div className="main-content__header header-block">
                <div className="row__header">
                    <div className="row__wrapper">
                        <img src="/assets/img/user.svg" className="lg-avatar-1 img-circle" alt=""/>
                        <div className="title">{facility.name}</div>
                    </div>
                    <button type="button" onClick={() => this.onEditFacility(facility)} className="btn-edit btn--white">
                        Edit facility
                    </button>
                </div>
                <ul className="row__info main-info">
                    <li className="text-center">
                        <div className="text-light-grey">Status</div>
                        <div className="info-label">{facility.status ? facility.status : "None"}</div>
                    </li>
                    <li className="text-center">
                        <div className="text-light-grey">City</div>
                        <div className="info-label">{facility.city ? facility.city : "None"}</div>
                    </li>
                    <li className="text-center">
                        <div className="text-light-grey">Region</div>
                        <div className="info-label">None</div>
                    </li>
                    <li className="text-center">
                        <div className="text-light-grey">State</div>
                        <div className="info-label">None</div>
                    </li>
                    <li className="text-center">
                        <div className="text-light-grey">Zip code</div>
                        <div className="info-label">{facility.zipCode ? facility.zipCode : "None"}</div>
                    </li>
                </ul>
                <ul className="row__info additionl-info">
                    <li className="text-center">
                        <div className="text-light-grey">First address</div>
                        <div className="info-label">
                            {facility.addressOne ? facility.addressOne : "None"}
                        </div>
                    </li>
                    <li className="text-center">
                        <div className="text-light-grey">Second address</div>
                        <div className="info-label">
                            {facility.addressTwo ? facility.addressTwo : "None"}
                        </div>
                    </li>
                </ul>
            </div>
        )
    }
}