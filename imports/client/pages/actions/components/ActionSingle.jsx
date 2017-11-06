import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import autoBind from 'react-autobind';

export default class ActionSingle extends Component {
    constructor() {
        super();
        autoBind(this);
    }

    deleteAction() {
        
        const {action} = this.props;

        Meteor.call('action.delete', action._id, (err)=> {
            if (!err) {
                Notifier.success('Action deleted !');
                FlowRouter.reload();
            }
        });
    }

    onEditAction() {
        FlowRouter.go("action.edit", {actionId: this.props.action._id});
    }
    render() {
        const {action} = this.props;

        return (
            <tr>
                <td>{action.title}</td>
                <td>{action.description}</td>
                <td>
                    <a onClick={this.onEditAction}>Edit</a>
                    <button onClick={this.deleteAction}>Delete</button>
                </td>
            </tr>
        );
    }
}