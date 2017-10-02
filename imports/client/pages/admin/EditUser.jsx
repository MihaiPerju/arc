import React, {Component} from 'react';
import { createQueryContainer } from 'meteor/cultofcoders:grapher-react';
import query from '/imports/api/users/queries/singleUser.js';
import { AutoForm, AutoField, ErrorField } from 'uniforms-unstyled';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';

class EditUser extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            firstName: '',
            lastName: ''
        };
    }

    componentWillReceiveProps(newProps) {
        if(!this.props.data && newProps.data) {
            this.setState({
                email: newProps.data.emails[0].address,
                firstName: newProps.data.profile.firstName,
                lastName: newProps.data.profile.lastName
            });
        }
    }

    onSubmit(formData) {
        const {data} = this.props;

        Meteor.call('admin.editUser', data._id, formData, (err) => {
            if(!err) {
                Notifier.success('Data saved !');
                FlowRouter.go('/admin/user/list');
            }
        });
    }

    onChangField(fieldName, value) {
        const stateObj = {};
        stateObj[fieldName] = value;

        this.setState(stateObj);
    }

    render() {
        const {data, loading, error} = this.props;
        const {email, firstName, lastName} = this.state;

        if (loading) {
            return <div>
                <span>Loading</span>
            </div>
        }

        if (error) {
            return <div>
                <span>Error: {error.reason}</span>
            </div>
        }

        return (
            <AutoForm schema={EditSchema} onSubmit={this.onSubmit.bind(this)} ref="form">
                {this.state.error
                    ? <div className="error">{this.state.error}</div>
                    : ''
                }

                <AutoField name="profile.firstName"/>
                <ErrorField name="profile.firstName"/>

                <AutoField name="profile.lastName"/>
                <ErrorField name="profile.lastName"/>

                <AutoField name="email"/>
                <ErrorField name="email"/>

                <button type="submit">
                    Save
                </button>
            </AutoForm>
        );
    }
}

const EditSchema = new SimpleSchema({
    'profile.firstName': {type: String},
    'profile.lastName': {type: String},
    'email': {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    }
});

export default (props) => {
    const Container = createQueryContainer(query.clone({filters: {_id: FlowRouter.current().params.userId}}), EditUser, {
        single: true
    });

    return <Container />
};