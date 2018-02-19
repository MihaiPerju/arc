import React, {Component} from 'react';

export default class RegionContent extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="main-content flex-content region-content">
                <div className="intro-block text-center">
                    <i className="icon-globe"/>
                    <div className="text-light-grey">Region name</div>
                    <div className="region">Italy</div>
                </div>
                <div className="text-center">
                    <button className="btn-edit btn--white">Edit region</button>
                </div>
            </div>
        )
    }
}