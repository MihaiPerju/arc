import React from 'react';
import query from '/imports/api/comments/queries/commentsList';
import autoBind from 'react-autobind';
import { Container } from 'semantic-ui-react';
import CommentList from './components/CommentList';
import { createQueryContainer } from 'meteor/cultofcoders:grapher-react';
import { withQuery } from 'meteor/cultofcoders:grapher-react';

class CommentsListContainer extends React.Component {
    constructor () {
        super();

        autoBind(this);
    }

    render () {
        const {accountId} = this.props;

        return (
            <Container>
                <CommentList accountId={accountId}/>
            </Container>
        );
    }
}

export default withQuery((props) => {
    return query.clone({
        options: {
            sort: {
                createdAt: -1
            }
        }
    });
}, {reactive: true})(CommentList);