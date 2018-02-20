import React from 'react';
import query from '/imports/api/comments/queries/commentsList';
import autoBind from 'react-autobind';
import {Container} from 'semantic-ui-react'
import CommentList from './components/CommentList';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import {withQuery} from 'meteor/cultofcoders:grapher-react';

class CommentsListContainer extends React.Component {
    constructor() {
        super();

        autoBind(this);
    }

    render() {
        const {taskId} = this.props;

        return (
            <Container>
                <CommentList taskId={taskId}/>
            </Container>
        )
    }
}

export default withQuery((props) => {
    return query.clone();
}, {reactive: true})(CommentList)