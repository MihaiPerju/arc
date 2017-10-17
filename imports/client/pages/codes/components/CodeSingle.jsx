import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import autoBind from 'react-autobind';

export default class CodeSingle extends Component {

    constructor() {
        super();
        autoBind(this);
    }

    deleteCode() {
        Meteor.call('code.delete', this.props.code._id, (err) => {
            if (!err) {
                Notifier.success('Code deleted !');
                FlowRouter.reload();
            }
        });
    }

    onEditCode() {
        FlowRouter.go("/code/:_id/edit", {_id: this.props.code._id});
    }

    render() {
        const {code} = this.props;

        return (
            <tr>
                <td>{code.code}</td>
                <td>{code.action}</td>
                <td>{code.type}</td>
                <td>{code.description}</td>
                <td>{code.description_short}</td>
                <td>{code.denial_action}</td>
                <td>
                    <a onClick={this.onEditCode}>Edit Code</a>

                    <button onClick={this.deleteCode}>Delete</button>
                </td>
            </tr>
        );
    }
}