import React from 'react';
import {Meteor} from 'meteor/meteor';
import {AutoForm, AutoField, ErrorField} from '/imports/ui/forms';
import MyProfileSchema from '/imports/api/users/schemas/MyProfileSchema';
import {Notifier, Loading} from '/imports/client/utils';
import createUserContainer from '/imports/client/lib/createUserContainer';
import MyAvatar from './components/MyAvatar';

class MyProfile extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit = (data) => {
        Meteor.call('users.my_profile.update', data, (err, res) => {
            if (!err) {
                Notifier.success('Profile has been updated');
                this.setState({error: null})
            } else {
                Notifier.error();
                this.setState({error: err.reason})
            }
        })
    };

    render() {
        const {user} = this.props;
        const {error} = this.state;

        if (!user) {
            return <Loading/>
        }

        const model = {
            profile: user.profile,
            email: user.getEmail(),
        };

        return (
            <div className="cc-container settings-container">
                <div className="create-form">
                    <div className="create-form__wrapper">
                        <div className="action-block drop-file i--block">
                            <MyAvatar user={user}/>
                            <AutoForm schema={MyProfileSchema} onSubmit={this.onSubmit} model={model}>
                                {error && <div className="error">{error}</div>}

                                <div className="form-wrapper">
                                    <AutoField labelHidden={true} placeholder="First Name" name="profile.firstName"/>
                                    <ErrorField name="profile.firstName"/>
                                </div>

                                <div className="form-wrapper">
                                    <AutoField labelHidden={true} placeholder="Last Name" name="profile.lastName"/>
                                    <ErrorField name="profile.lastName"/>
                                </div>

                                <div className="form-wrapper">
                                    <AutoField labelHidden={true} placeholder="Email" name="email"/>
                                    <ErrorField name="email"/>
                                </div>

                                <div className="form-wrapper">
                                    <AutoField labelHidden={true} placeholder="Phone Number"
                                               name="profile.phoneNumber"/>
                                    <ErrorField name="profile.phoneNumber"/>
                                </div>
                                <div className="btn-group">
                                    <button type="submit" className="btn--green">Update</button>
                                </div>
                            </AutoForm>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default createUserContainer(MyProfile);