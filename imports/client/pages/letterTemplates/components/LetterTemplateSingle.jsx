import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import autoBind from 'react-autobind';

export default class LetterSingle extends Component {
    constructor() {
        super();
        autoBind(this);
    }

    deleteLetterTemplate() {
        Meteor.call('letterTemplate.delete', this.props.letterTemplate._id, (err) => {
            if (!err) {
                Notifier.success('Letter template deleted !');
                FlowRouter.reload();
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    onEditLetterTemplate() {
        FlowRouter.go("/letter-template/:_id/edit", {_id: this.props.letterTemplate._id});
    }

    render() {
        const {letterTemplate} = this.props;

        return (
            <tr>
                <td>{letterTemplate.name}</td>
                <td>
                    <a onClick={this.onEditLetterTemplate}>Edit</a>

                    <button onClick={this.deleteLetterTemplate}>Delete</button>
                </td>
            </tr>
        );
    }
}