import React, {Component} from 'react';
import classNames from "classnames";
import {getImagePath} from "../../../../../api/utils";

export default class FacilitySingle extends Component {
    constructor(props) {
        super(props);
    }

    onSetFacility() {
        const {facility, setFacility} = this.props;
        setFacility(facility._id);
    }

    onSelectFacility(e) {
        e.stopPropagation();
        const {facility, selectFacility} = this.props;
        selectFacility(facility._id);
    }

    render() {
        const {facility, facilitiesSelected, currentFacility} = this.props;
        const checked = facilitiesSelected.includes(facility._id);
        const classes = classNames({
            "list-item user-item": true,
            "bg--yellow": checked,
            "open": currentFacility === facility._id
        });
        return (
            <div
                className={classes}
                onClick={this.onSetFacility.bind(this)}>
                <div className="check-item">
                    <input checked={checked} type="checkbox" className="hidden"/>
                    <label onClick={this.onSelectFacility.bind(this)}></label>
                </div>
                <div className="row__block align-center">
                    <div className="item-name">{facility.name}</div>
                    <img src={facility.logoPath ? getImagePath(facility.logoPath) : "/assets/img/user1.svg"}
                         className="md-avatar"
                         alt=""
                    />
                </div>
            </div>
        )
    }
}