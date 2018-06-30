import React from "react";
import autoBind from "react-autobind";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/accountActions/queries/accountActionList";
import CommentList from "./components/CommentList";
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

    return <CommentList account={account} comments={data} />;
  }
}

export default withQuery(
  props => {
    const { account } = props;
    return query.clone({
      options: {
        sort: {
          createdAt: 1
        }
      },
      filters: {
        type: "comment",
        accountId: account && account._id
      }
    });
  },
  { reactive: true }
)(CommentsListContainer);
