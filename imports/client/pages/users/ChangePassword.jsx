import React from 'react';
import {AutoForm, AutoField, ErrorField} from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import {Notifier} from '/imports/client/utils';
import {Container} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'

class ChangePassword extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    onSubmit = ({current_password, password}) => {
        Accounts.changePassword(current_password, password, (err) => {
            if (!err) {
                Notifier.success('Password changed');
                this.setState({error: null});
                this.form.reset();
            } else {
                Notifier.error();
                this.setState({
                    error: err.reason
                })
            }
        })
    };

    onFormMount = (node) => this.form = node;

    render() {
        const {error} = this.state;
        return (
            <Container className="page-container">
                <AutoForm schema={ChangePasswordSchema} onSubmit={this.onSubmit} ref={this.onFormMount}>
                    {error && <div className="error">{error}</div>}

                    <AutoField name="current_password" type="password"/>
                    <ErrorField name="current_password"/>

                    <AutoField name="password" type="password"/>
                    <ErrorField name="password"/>

                    <AutoField name="confirm_password" type="password"/>
                    <ErrorField name="confirm_password"/>

                    <Divider/>

                    <Button fluid primary type="submit">
                        Change Password
                    </Button>
                </AutoForm>
            </Container>
        )
    }
}

const ChangePasswordSchema = new SimpleSchema({
    current_password: {type: String},
    password: {type: String},
    confirm_password: {
        type: String,
        custom() {
            if (this.value != this.field('password').value) {
                return 'passwordMismatch';
            }
        }
    }
});


export default ChangePassword;