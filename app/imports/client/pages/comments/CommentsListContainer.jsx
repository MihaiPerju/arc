import React from "react";
import query from "/imports/api/comments/queries/commentsList";
import autoBind from "react-autobind";
import { Container } from "semantic-ui-react";
import CommentList from "./components/CommentList";
import { createQueryContainer } from "meteor/cultofcoders:grapher-react";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import Loading from "/imports/client/lib/ui/Loading";

class CommentsListContainer extends React.Component {
  constructor() {
    super();

    autoBind(this);
  }

  render() {
    const { account, data, isLoading, error } = this.props;
    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error.reason}</div>;
    }
    return (
      <Container>
        <CommentList accountId={account} commentList={data} />
      </Container>
    );
  }
}

export default withQuery(
  props => {
    const { account } = props;
    return query.clone({
      filters: {
        accountId: account
      },
      options: {
        sort: {
          createdAt: -1
        }
      }
    });
  },
  { reactive: true }
)(CommentsListContainer);
