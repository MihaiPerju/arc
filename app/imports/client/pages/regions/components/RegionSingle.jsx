import React, {Component} from 'react';
import classNames from "classnames";

export default class RegionSingle extends Component {
    constructor(props) {
        super(props);
    }

    onSetRegion() {
        const {region, setRegion} = this.props;
        setRegion(region._id);
    }

    onSelectRegion(e) {
        e.stopPropagation();
        const {region, selectRegion} = this.props;
        selectRegion(region._id);
    }

    render() {
        const {region, regionsSelected, currentRegion} = this.props;
        const checked = regionsSelected.includes(region._id);
        const classes = classNames({
            "list-item": true,
            "bg--yellow": checked,
            "open": currentRegion === region._id
        });
        return (
            <div onClick={this.onSetRegion.bind(this)}
                 className={classes}>
                <div className="check-item">
                    <input checked={checked} type="checkbox" className="hidden"/>
                    <label onClick={this.onSelectRegion.bind(this)}></label>
                </div>
                <div className="row__block align-center">
                    <div className="item-name">{region.name}</div>
                </div>
            </div>
        );
    }
}