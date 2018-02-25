import React, {Component} from 'react';

export default class UploadItem extends Component {
    render() {
		const { status, city, region, state, zip } = this.props;

        return (
            <ul className="upload-item">
                <li className="text-center">
                    <div className="text-light-grey">Status</div>
                    <div className="info-label">{status}</div>
                </li>
                <li className="text-center">
                    <div className="text-light-grey">City</div>
                    <div className="info-label">{city}</div>
                </li>
                <li className="text-center">
                    <div className="text-light-grey">Region</div>
                    <div className="info-label">{region}</div>
                </li>
                <li className="text-center">
                    <div className="text-light-grey">State</div>
                    <div className="info-label">{state}</div>
                </li>
                <li className="text-center">
                    <div className="text-light-grey">Zip code</div>
                    <div className="info-label">{zip}</div>
                </li>
            </ul>
        )
    }
}