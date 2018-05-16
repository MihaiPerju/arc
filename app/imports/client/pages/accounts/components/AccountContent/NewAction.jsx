import React, {Component} from 'react';
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';
import SimpleSchema from 'simpl-schema';
import query from '/imports/api/actions/queries/actionList';
import Notifier from '../../../../lib/Notifier';
import reasonCodesQuery from '/imports/api/reasonCodes/queries/reasonCodesList';
import Loading from "/imports/client/lib/ui/Loading";

const ActionSchema = new SimpleSchema({
    action: {
        type: String,
        optional: true
    },
    reasonCode: {
        type: String,
        optional: true
    }
});

export default class NewAction extends Component {
    constructor() {
        super();
        this.state = {
            fade: false,
            actions: [],
            reasonCodes: [],
            loading: true
        };
    }

    getActionOptions(actions) {
        return _.map(actions, ({_id, title}) => {
            const value = title;
            return {value: _id, label: value};
        });
    }

    componentWillMount() {
        query.clone().fetch((err, actions) => {
            if (!err) {
                this.setState({
                    actions,
                    loading: false
                });
            }
        });
    }

    componentWillReceiveProps(props) {
        const {actionId} = this.state;

    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({fade: true});
        }, 1);
    }

    getReasonOptions(reasons) {
        return _.map(reasons, ({_id, reason}) => {
            return {value: _id, label: reason};
        });
    }

    onSubmit(data) {
        const {account, hide} = this.props;
        data.accountId = account._id;
        if(account.assignee) {
            data.addedBy = `${account.assignee.profile.firstName} ${account.assignee.profile.lastName}`;
        } else if(account.workQueue) {
            data.addedBy = account.tag.name;
        }
        Meteor.call('account.actions.add', data
            , (err) => {
                if (!err) {
                    Notifier.success('Data saved');
                    //Clear inputs
                    this.refs.form.reset();
                    hide();
                } else {
                    Notifier.error(err.reason);
                }
            });
    }

    onHide(e) {
        const {hide} = this.props;
        hide();
    }

    onHandleChange = (field, value) => {
        if (field == 'action') {
            const actionId = value;
            if (actionId) {
                reasonCodesQuery.clone({
                    filters: {
                        actionId: actionId
                    }
                }).fetch((err, reasonCodes) => {
                    if (!err) {
                        this.setState({
                            reasonCodes
                        });
                    }
                });
            }
        }
    };

    render() {
        const {loading} = this.state;
        const actions = this.getActionOptions(this.state.actions);
        const reasonCodes = this.getReasonOptions(this.state.reasonCodes);

        if (loading) {
            return <Loading />
        }
        return (
            <div className={this.state.fade ? 'new-action in' : 'new-action'}>
                <div className="action-info">
                    <img className="md-avatar img-circle" src="/assets/img/user1.svg" alt=""/>
                    <div className="name">Solomon Ben</div>
                </div>

                <div className="action-form">
                    <AutoForm schema={ActionSchema} onSubmit={this.onSubmit.bind(this)} onChange={this.onHandleChange}
                              ref="form">
                        <div className="select-row">
                            <div className="select-group">
                                <AutoField labelHidden={true} name="action" options={actions}/>
                                <ErrorField name="action"/>
                            </div>
                            {reasonCodes.length > 0 &&
                            <div className="select-group">
                                <AutoField labelHidden={true} name="reasonCode" options={reasonCodes}/>
                                <ErrorField name="reasonCode"/>
                            </div>
                            }
                        </div>
                        <div className="btn-group">
                            <button type="button" className="btn--red" onClick={this.onHide.bind(this)}>Cancel</button>
                            <button type="submit" className="btn--green">Save</button>
                        </div>
                    </AutoForm>
                </div>
            </div>
        );
    }
}