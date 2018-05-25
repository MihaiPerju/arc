import React from "react";
import autoBind from "react-autobind";
import { Container } from "semantic-ui-react";
import CommentList from "./components/CommentList";

export default class CommentsListContainer extends React.Component {
  constructor() {
    super();

    autoBind(this);
  }

  render() {
    const { account } = this.props;
    return (
      <Container>
        <CommentList account={account} />
      </Container>
    );
  }
}
