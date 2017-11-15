import React from 'react';
import query from '/imports/api/comments/queries/commentsList';
import autoBind from 'react-autobind';
import {Container} from 'semantic-ui-react'
import CommentList from './components/CommentList';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';

export default class CommentsListContainer extends React.Component {
    constructor() {
        super();

        autoBind(this);
    }

    render() {
        const {taskId} = this.props;

        this.query = query.clone({
            filters: {
                taskId
            }
        });

        this.CommentListCont = createQueryContainer(this.query, CommentList, {
            reactive: true
        });

        const CommentListCont = this.CommentListCont;

        return (
            <Container>
                <CommentListCont taskId={taskId}/>
            </Container>
        )
    }
}