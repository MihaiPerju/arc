import React from 'react';
import {Meteor} from 'meteor/meteor';
import {AutoForm, AutoField, ErrorField} from 'uniforms-semantic';
import MyProfileSchema from '/imports/api/users/schemas/MyProfileSchema';
import {Notifier, Loading} from '/imports/client/utils';
import createUserContainer from '/imports/client/lib/createUserContainer';
import MyAvatar from './components/MyAvatar';
import {Container} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'

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
            email: user.getEmail()
        };

        return (
            <Container textAlign="center">
                <MyAvatar user={user}/>
                <AutoForm schema={MyProfileSchema} onSubmit={this.onSubmit} model={model}>
                    {error && <div className="error">{error}</div>}

                    <AutoField name="profile.firstName"/>
                    <ErrorField name="profile.firstName"/>

                    <AutoField name="profile.lastName"/>
                    <ErrorField name="profile.lastName"/>

                    <AutoField name="email"/>
                    <ErrorField name="email"/>

                    <Divider/>

                    <Button fluid primary type="submit">
                        Update
                    </Button>
                </AutoForm>
            </Container>
        )
    }
}

export default createUserContainer(MyProfile);