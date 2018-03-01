import React, {Component} from 'react';

export default class ActionCreate extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div className="create-form action-create-form">
                <form action="">
                    <div className="create-form__bar">
                        <button className="btn-add">+ Add action</button>
                        <div className="btn-group">
                            <button className="btn-cancel">Cancel</button>
                            <button className="btn--green">Confirm & save</button>
                        </div>
                    </div>
                    <div className="create-form__wrapper">
                        <div className="action-block">
                            <div className="form-wrapper">
                                <input type="text" placeholder="Action name"/>
                            </div>
                            <div className="form-wrapper">
                                <textarea placeholder="Description"></textarea>
                            </div>
                            <div className="check-group">
                                <input type="checkbox" id="m1" name="allowedRoles" value="on"/>
                                <label htmlFor="m1">Allow manager role</label>
                            </div>
                            <div className="select-group">
                                <div className="form-wrapper">
                                    <select name="filter">
                                        <option value="">Select category</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
