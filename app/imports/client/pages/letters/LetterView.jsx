import React from "react";
import { Container, Header } from "semantic-ui-react";
import Loading from "/imports/client/lib/ui/Loading.jsx";
import Notifier from "/imports/client/lib/Notifier";
import AccountViewService from "/imports/client/pages/accounts/services/AccountViewService";
import { Meteor } from "meteor/meteor";

export default class LetterView extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    const { letterId } = FlowRouter.current().params;
    Meteor.call("letter.get", { _id: letterId }, (err, letter) => {
      if (!err) {
        this.setState({
          letter,
          loading: false
        });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  render() {
    const { loading, letter } = this.state;

    if (loading) {
      return <Loading />;
    }

    return (
      <Container className="page-container">
        <Header as="h2" textAlign="center">
          Letter ID: {letter._id}
        </Header>
        <div dangerouslySetInnerHTML={{ __html: letter.body }} />
        <h3>Attachments</h3>
        {letter.attachments &&
          _.map(letter.attachments, letter => {
            return <li>{AccountViewService.getPdfName(letter)}</li>;
          })}
      </Container>
    );
  }
}
