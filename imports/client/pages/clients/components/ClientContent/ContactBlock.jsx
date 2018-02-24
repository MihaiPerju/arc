import React, {Component} from 'react';

export default class ContactBlock extends Component {
    render() {
        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">contact information</div>
                </div>
                <div className="main__block">
                    <ul className="contact-info">
                        <li className="text-center">
                            <div className="text-light-grey">First name</div>
                            <div className="l-info">Fertimanschi</div>
                        </li>
                        <li className="text-center">
                            <div className="text-light-grey">Last name</div>
                            <div className="l-info">Vello</div>
                        </li>
                        <li className="text-center">
                            <div className="text-light-grey">Phone number</div>
                            <div className="l-info">(249) 456-4567</div>
                        </li>
                        <li className="text-center">
                            <div className="text-light-grey">Email</div>
                            <div className="l-info text-blue">contact@email</div>
                        </li>
                        <li className="text-center">
                            <div className="text-light-grey">Contact description</div>
                            <div className="l-info">Nice person to call</div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
} 