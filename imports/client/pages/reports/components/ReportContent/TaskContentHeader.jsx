import React, {Component} from 'react';
import moment from "moment/moment";

export default class TaskContentHeader extends Component {

    render() {
        const { client } = this.props;

        return (
            <div className="header-block">
                <div className="main-info">
                    <div className="left__side">
                        <div className="name">{client}</div>
                        <div className="row__block">
                            <div className="pacient-id text-blue">MBG981828112</div>
                            <div className="financial-class">O/D</div>
                            <div className="location">New York-Presbyterian University Hospita</div>
                            <div className="label-group">
                                <div className="label label--green">158 points(TBM)</div>
                                <div className="label label--grey text-uppercase">carc(TNM)</div>
                                <div className="label label--grey">Work queue(TBM)</div>
                            </div>
                        </div>
                    </div>
                    <div className="right__side">
                        <div className="price-col">
                            <div className="price">0.00(TBM)</div>
                            <div className="text-light-grey">Collected amount</div>
                        </div>
                        <div className="price-col">
                            <div className="price">18,586(TBM)</div>
                            <div className="text-light-grey">Remaining balance</div>
                        </div>
                    </div>
                </div>
                <div className="additional-info">
                    <ul>
                        <li className="text-center">
                            <div className="text-light-grey">Status Code</div>
                            <div className="text-dark-grey text-uppercase">invden(TBM)</div>
                        </li>
                        <li className="text-center">
                            <div className="text-light-grey">Financial class</div>
                            <div className="text-dark-grey text-uppercase">d</div>
                        </li>
                        <li className="text-center">
                            <div className="text-light-grey">Admin date</div>
                            <div className="text-dark-grey">03/15/2018</div>
                        </li>
                        <li className="text-center">
                            <div className="text-light-grey">Discharge date</div>
                            <div className="text-dark-grey">03/15/2018</div>
                        </li>
                        <li className="text-center">
                            <div className="text-light-grey">Placement date</div>
                            <div className="text-dark-grey">12/05/2018(TBM)</div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}