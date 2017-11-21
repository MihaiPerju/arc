import React from 'react';
import query from '/imports/api/actions/queries/actionList'; 
import {ErrorField} from 'uniforms-semantic';
import SelectSimple from "/imports/client/lib/uniforms/SelectSimple.jsx";

export default class SelectActionsContainer extends React.Component {
    constructor() {
        super();

        this.state = {
            actions: []
        }
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

    getActionOptions(actions) {
        return _.map(actions, ({_id, title}) => {
            const value = title;
            return {value: _id, label: value};
        })
    }

    render() {
        const actions = this.getActionOptions(this.state.actions);

        return (
            <div>
                <SelectSimple name="action" options={actions}/>
                <ErrorField name="action"/>
            </div>
        )
    }
}