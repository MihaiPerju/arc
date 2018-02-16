import React, {Component} from 'react';
import SelectBlock from '/imports/client/lib/SelectBlock.jsx';
import {AutoForm} from 'uniforms-semantic';
import SimpleSchema from "simpl-schema";
import SelectSimple from "/imports/client/lib/uniforms/SelectSimple.jsx";
import {ErrorField} from '/imports/';

const ActionSchema = new SimpleSchema({
    action: {
        type: String,
        optional: true
    }
});

export default class NewAction extends Component {
    constructor() {
        super();
        this.state = {
            fade: false
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({fade: true});
        }, 1);
    }

    render() {
        return (
            <div className={this.state.fade ? "new-action in" : "new-action"}>
                <div className="action-info">
                    <img className="md-avatar img-circle" src="/assets/img/user1.svg" alt=""/>
                    <div className="name">Solomon Ben</div>
                </div>
                <AutoForm schema={ActionSchema} onSubmit={this.onSubmit} ref="form">
                    <SelectSimple name="action" options={[{value: 1, label: 1},{value:2,label:2}]}/>
                    <ErrorField name="action"/>
                </AutoForm>
                <form action="" className="action-form">
                    <SelectBlock header={'Select action'}/>
                    <div className="form-group">
                        <input type="text" placeholder="Note"/>
                    </div>
                    <div className="btn-group">
                        <button className="btn--red">Cancel</button>
                        <button className="btn--green">Save</button>
                    </div>
                </form>
            </div>
        )
    }
}