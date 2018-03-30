import React, {Component} from 'react';
import TaskContentHeader from './components/TaskContent/TaskContentHeader';
import InvoiceMembers from './components/TaskContent/InvoiceMembers';
import PayerBlock from './components/TaskContent/PayerBlock';
import ActionBlock from './components/TaskContent/ActionBlock';
import LetterList from './components/TaskContent/LetterList';
import PdfFiles from './components/TaskContent/PdfFiles';
import EscalateReason from './components/TaskContent/EscalateReason';
import CommentBlock from './components/TaskContent/CommentBlock';
import CommentsListContainer from '/imports/client/pages/comments/CommentsListContainer.jsx';

export default class TaskContent extends Component {
    constructor() {
        super();
    }

    escalateReason() {
        const {task} = this.props;
        const {state} = FlowRouter.current().params;
        if (state === "escalated") {
            return (
                <EscalateReason reason={task.escalateReason}/>
            );
        }
    }

    render() {
        const {task, update} = this.props;
        return (
            <div className="main-content">
                <TaskContentHeader task={task}/>
                {this.escalateReason()}
                <PayerBlock task={task}/>
                <InvoiceMembers/>
                <ActionBlock update={update} task={task}/>
                <LetterList task={task} refetch={update}/>
                <PdfFiles update={update} task={task}/>
                <CommentsListContainer taskId={task._id}/>
            </div>
        )
    }
}