import React from "react";
import { AutoForm, AutoField, ErrorField } from "uniforms-unstyled";
import SimpleSchema from "simpl-schema";
import Notifier from "/imports/client/lib/Notifier";
import { Container } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Divider } from "semantic-ui-react";

class ResetPassword extends React.Component {
  constructor() {
    super();

    this.state = {
      error: null
    };
  }

  onSubmit = data => {
    const { password } = data;
    const token = FlowRouter.current().params.token;

    Accounts.resetPassword(token, password, err => {
      if (!err) {
        Notifier.success("Password reset !");
        FlowRouter.go("/login");
      } else {
        this.setState({ error: err.reason });
      }
    });
  };

  render() {
    const { error } = this.state;

    return (
      <Container className="page-container">
        <AutoForm schema={ResetPasswordSchema} onSubmit={this.onSubmit}>
          {error && <div className="error">{error}</div>}

          <AutoField name="password" type="password" />
          <ErrorField name="password" />

          <AutoField name="confirm_password" type="password" />
          <ErrorField name="confirm_password" />

          <Divider />

          <Button fluid primary type="submit">
            Reset
          </Button>
        </AutoForm>
      </Container>
    );
  }
}

const ResetPasswordSchema = new SimpleSchema({
  password: { type: String },
  confirm_password: {
    type: String,
    custom() {
      if (this.value != this.field("password").value) {
        return "passwordMismatch";
      }
    }
  }
});

export default ResetPassword;
