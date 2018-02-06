import React, {Component} from 'react';

export default class TaskContentHeader extends Component {
    
    render() {
        return (
            <div className="header-block">
                <div className="main-info">
                    <div className="left__side">
                        <div className="name">Claudio Steel</div>
                        <div className="row__block">
                            <div className="pacient-id text-blue">MBG981828112</div>
                            <div className="financial-class">O/D</div>
                            <div className="location">New York-Presbyterian University Hospital</div>
                            <div className="label-group">
                                <div className="label label--green">158 points</div>
                                <div className="label label--grey text-uppercase">carc</div>
                                <div className="label label--grey">Work queue</div>
                            </div>
                        </div>
                    </div>
                    <div className="right__side">
                        <div className="price-col">
                            <div className="price">0.00</div>
                            <div className="text-light-grey">Collected amount</div>
                        </div>
                        <div className="price-col">
                            <div className="price">18,586</div>
                            <div className="text-light-grey">Remaining balance</div>
                        </div>
                    </div>
                </div>
                <div className="additional-info">
                    <ul>
                        <li className="text-center">
                            <div className="text-light-grey">Status Code</div>
                            <div className="text-dark-grey text-uppercase">invden</div>
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
                            <div className="text-dark-grey">09/16/2018</div>
                        </li>
                        <li className="text-center">
                            <div className="text-light-grey">Placement date</div>
                            <div className="text-dark-grey">12/05/2018</div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}