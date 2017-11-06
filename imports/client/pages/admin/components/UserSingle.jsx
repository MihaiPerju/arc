import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import {Table} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'

export default class UserSingle extends Component {
    deleteUser() {
        const {user} = this.props;

        Meteor.call('admin.deleteUser', user._id, (err) => {
            if (!err) {
                Notifier.success('User deleted !');
                FlowRouter.reload();
            }
        });
    }

    suspendUser() {
        const {user} = this.props;

        Meteor.call('admin.suspendUser', user._id, (err) => {
            if (!err) {
                Notifier.success('User suspended !');
                FlowRouter.reload();
            }
        });
    }

    resumeUser() {
        const {user} = this.props;

        Meteor.call('admin.resumeUser', user._id, (err) => {
            if (!err) {
                Notifier.success('User resumed !');
                FlowRouter.reload();
            }
        });
    }

    render() {
        const {user} = this.props;

        return (
            <Table.Row>
                <Table.Cell>{user.emails[0].address}</Table.Cell>
                <Table.Cell>
                    <Button.Group>
                        <Button primary href={"/admin/user/" + user._id + "/edit"}>Edit</Button>
                        {user.profile.suspended ?
                            <Button onClick={this.resumeUser.bind(this)}>Resume</Button>
                            :
                            <Button color="black" onClick={this.suspendUser.bind(this)}>Suspend</Button>
                        }
                        <Button color="red" onClick={this.deleteUser.bind(this)}>Delete</Button>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}