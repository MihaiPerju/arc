import React, {Component} from 'react';
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';
import SimpleSchema from "simpl-schema";
import actionsQuery from '/imports/api/actions/queries/actionList';
import query from "../../../../../api/actions/queries/actionList";
import Notifier from "../../../../lib/Notifier";

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
            fade: false,
            actions: []
        }
    }

    getActionOptions(actions) {
        return _.map(actions, ({_id, title}) => {
            const value = title;
            return {value: _id, label: value};
        })
    }

    componentWillMount() {
        query.clone().fetch((err, actions) => {
            if (!err) {
                this.setState({
                    actions
                })
            }
        })
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({fade: true});
        }, 1);
    }

    onSubmit(data) {
        const {task, hide} = this.props;
        Meteor.call('task.actions.add', task._id, data.action
            , (err) => {
                if (!err) {
                    Notifier.success("Data saved");
                    // this.getTask();
                    //Clear inputs
                    this.refs.form.reset();
                    hide();
                } else {
                    Notifier.error(err.reason);
                }
            })
    }

    render() {
        const actions = this.getActionOptions(this.state.actions);
        return (
            <div className={this.state.fade ? "new-action in" : "new-action"}>
                <div className="action-info">
                    <img className="md-avatar img-circle" src="/assets/img/user1.svg" alt=""/>
                    <div className="name">Solomon Ben</div>
                </div>

                <div className="action-form">
                    <AutoForm schema={ActionSchema} onSubmit={this.onSubmit.bind(this)} ref="form">
                        <AutoField name="action" options={actions}/>
                        <ErrorField name="action"/>
                        {/*<div className="form-group">*/}
                        {/*<input type="text" placeholder="Note"/>*/}
                        {/*</div>*/}
                        <div className="btn-group">
                            <button className="btn--red">Cancel</button>
                            <button type="submit" className="btn--green">Save</button>
                        </div>
                    </AutoForm>
                </div>
            </div>
        )
    }
}