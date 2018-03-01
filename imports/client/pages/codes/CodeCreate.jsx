import React, {Component} from 'react';

export default class CodeCreate extends Component {
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
                        <div className="action-block i--block">
                            <div className="form-wrapper">
                                <input type="text" placeholder="Code name"/>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="Action"/>
                            </div>
                            <div className="select-group">
                                <div className="form-wrapper">
                                    <select name="filter">
                                        <option value="">Select category</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-wrapper">
                                <textarea placeholder="Description"></textarea>
                            </div>
                            <div className="form-wrapper">
                                <textarea placeholder="*Note"></textarea>
                            </div>
                            <div className="form-wrapper">
                                <input type="text" placeholder="Action"/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}