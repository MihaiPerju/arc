import React, {Component} from 'react';
import RichTextArea from "/imports/client/lib/uniforms/RichTextArea.jsx";

export default class CreateLetterTemplate extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {

        return (
            <div className="create-form">
                <div className="create-form__bar">
                    <button className="btn-add">+ Add letter template</button>
                    <div className="btn-group">
                        <button className="btn-cancel">Cancel</button>
                        <button className="btn--green">Confirm & save</button>
                    </div>
                </div>
                <div className="create-form__wrapper">
                    <div className="action-block">
                        <form action="">
                            <div className="form-wrapper">
                                <input type="text" placeholder="Letter name"/>
                            </div>
                            <div className="form-wrapper">
                                <textarea placeholder="Description"/>
                            </div>
                            <div className="form-wrapper">
                                <RichTextArea/>
                            </div>
                            <div className="select-group">
                                <div className="form-wrapper">
                                    <select>
                                        <option>Select category</option>
                                        <option>Category 1</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
