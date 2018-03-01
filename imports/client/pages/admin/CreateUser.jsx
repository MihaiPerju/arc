import React, {Component} from 'react';

export default class CreateUser extends Component {
    constructor() {
        super();

        this.state = {};
    }

    render() {
        return (
            <div className="create-form">
                <form action="">
                    <div className="create-form__bar">
                        <button className="btn-add">+ Add user</button>
                        <div className="btn-group">
                            <button className="btn-cancel">Cancel</button>
                            <button className="btn--green">Confirm & save</button>
                        </div>
                    </div>
                    <div className="create-form__wrapper">
                        <div className="action-block">
                            <div className="form-wrapper">
                                <input type="text" placeholder="First name"/>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="Last name"/>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="Email"/>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="Phone number"/>
                            </div>
                            <div className="form-wrapper">
                                <input type="password" placeholder="Password"/>
                            </div>

                            <div className="form-wrapper">
                                <input type="password" placeholder="Confirm password"/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}