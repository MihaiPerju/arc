import React, {Component} from 'react';

export default class FacilityContentHeader extends Component {
    render() {
        const {facility} = this.props;
        return (
            <div className="main-content__header header-block">
                <div className="row__header">
                    <div className="row__wrapper">
                        <img src="/assets/img/user.svg" className="lg-avatar-1 img-circle" alt=""/>
                        <div className="title">{facility.name}</div>
                    </div>
                    <button className="btn-edit btn--white">Edit facillity</button>
                </div>
                <ul className="row__info main-info">
                    <li className="text-center">
                        <div className="text-light-grey">Status</div>
                        <div className="info-label">{facility.status}</div>
                    </li>
                    <li className="text-center">
                        <div className="text-light-grey">City</div>
                        <div className="info-label">None</div>
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
                        <div className="info-label">None</div>
                    </li>
                </ul>
                <ul className="row__info additionl-info">
                    <li className="text-center">
                        <div className="text-light-grey">First adress</div>
                        <div className="info-label">None</div>
                    </li>
                    <li className="text-center">
                        <div className="text-light-grey">Second adress</div>
                        <div className="info-label">None</div>
                    </li>
                </ul>
            </div>
        )
    }
}