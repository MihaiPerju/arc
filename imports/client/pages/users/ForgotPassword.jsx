import React from 'react';
import {AutoForm, AutoField, ErrorField} from 'uniforms-semantic';
import SimpleSchema from 'simpl-schema';
import Notifier from '/imports/client/lib/Notifier';
import {Container} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'

class ForgotPassword extends React.Component {
    constructor() {
        super();

        this.state = {
            error: null
        }
    }

    onSubmit = (data) => {
        const {email} = data;

        Accounts.forgotPassword({email}, (err) => {
            if (!err) {
                Notifier.success('Recover Email sent !');
            } else {
                this.setState({error: err.reason});
            }
        });
    };

    render() {
        const {error} = this.state;
        return (
            <Container textAlign="center">
                <AutoForm schema={ForgotPasswordSchema} onSubmit={this.onSubmit}>
                    {error && <div className="error">{error}</div>}
                    <AutoField name="email"/>
                    <ErrorField name="email"/>

                    <Divider/>

                    <Button primary fluid type="submit">
                        Send
                    </Button>
                </AutoForm>
            </Container>
        )
    }
}

const ForgotPasswordSchema = new SimpleSchema({
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    }
});

export default ForgotPassword;