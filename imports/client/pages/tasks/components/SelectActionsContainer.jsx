import React from 'react';
import query from '/imports/api/actions/queries/actionList';
import reasonCodesQuery from '/imports/api/reasonCodes/queries/reasonCodesList';
import { ErrorField } from 'uniforms-semantic';
import SelectSimple from '/imports/client/lib/uniforms/SelectSimple.jsx';

export default class SelectActionsContainer extends React.Component {
    constructor () {
        super();

        this.state = {
            actions: [],
            reasonCodes: []
        };
    }

    componentWillMount () {
        query.clone().fetch((err, actions) => {
            if (!err) {
                this.setState({
                    actions
                });
            }
        });
    }

    componentWillReceiveProps (props) {
        const {actionId} = props;
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

    getActionOptions (actions) {
        return _.map(actions, ({_id, title}) => {
            const value = title;
            return {value: _id, label: value};
        });
    }

    getReasonOptions (reasons) {
        return _.map(reasons, ({_id, reason}) => {
            return {value: _id, label: reason};
        });
    }

    render () {
        const actions = this.getActionOptions(this.state.actions);
        const reasonCodes = this.getReasonOptions(this.state.reasonCodes);
        return (
            <div>
                <SelectSimple name="action" options={actions}/>
                <ErrorField name="action"/>

                {this.props.actionId &&
                    <div>
                        <SelectSimple name="reasonCode" options={reasonCodes}/>
                        <ErrorField name="reasonCode"/>
                    </div>
                }

            </div>
        );
    }
}