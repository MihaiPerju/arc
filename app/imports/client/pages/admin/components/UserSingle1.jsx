import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import {Table} from 'semantic-ui-react'
import {Button, Dropdown} from 'semantic-ui-react'
import RolesEnum from '/imports/api/users/enums/roles';

export default class UserSingle extends Component {
    deleteUser() {
        const {user} = this.props;

        Meteor.call('admin.deleteUser', user._id, (err) => {
            if (!err) {
                Notifier.success('User deleted!');
                FlowRouter.reload();
            }
        });
    }

    userCanSuspend() {
        return Roles.userIsInRole(Meteor.userId(), RolesEnum.ADMIN);
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
                    <Dropdown button text='Action' icon={null}>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Button primary href={"/admin/user/" + user._id + "/edit"}>Edit</Button>
                            </Dropdown.Item>
                            {
                                user._id !== Meteor.userId() && this.userCanSuspend() &&

                                <Dropdown.Item>
                                    {user.profile.suspended ?
                                        <Button onClick={this.resumeUser.bind(this)}>Resume</Button>
                                        :
                                        <Button color="black" onClick={this.suspendUser.bind(this)}>Suspend</Button>
                                    }
                                </Dropdown.Item>
                            }
                            < Dropdown.Item>
                                < Button color="red" onClick={this.deleteUser.bind(this)}>Delete</Button>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
            </Table.Row>
        );
    }
}