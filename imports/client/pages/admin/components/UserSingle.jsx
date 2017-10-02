import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';

export default class UserSingle extends Component {
    deleteUser() {
        const {user} = this.props;

        Meteor.call('admin.deleteUser', user._id, (err)=> {
            if (!err) {
                Notifier.success('User deleted !');
                FlowRouter.reload();
            }
        });
    }

    suspendUser() {
        const {user} = this.props;

        Meteor.call('admin.suspendUser', user._id, (err)=> {
            if (!err) {
                Notifier.success('User suspended !');
                FlowRouter.reload();
            }
        });
    }

    resumeUser() {
        const {user} = this.props;

        Meteor.call('admin.resumeUser', user._id, (err)=> {
            if (!err) {
                Notifier.success('User resumed !');
                FlowRouter.reload();
            }
        });
    }

    render() {
        const {user} = this.props;

        return (
            <tr>
                <td>{user.emails[0].address}</td>
                <td>
                    <a href={"/admin/user/" + user._id + "/edit"}>Edit</a>
                    {user.profile.suspended ?
                        <button onClick={this.resumeUser.bind(this)}>Resume</button>
                        :
                        <button onClick={this.suspendUser.bind(this)}>Suspend</button>
                    }
                    <button onClick={this.deleteUser.bind(this)}>Delete</button>
                </td>
            </tr>
        );
    }
}