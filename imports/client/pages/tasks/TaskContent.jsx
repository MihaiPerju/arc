import React, {Component} from 'react';
import TaskContentHeader from './components/TaskContent/TaskContentHeader';
import PayerBlock from './components/TaskContent/PayerBlock';
import ActionBlock from './components/TaskContent/ActionBlock';
import LetterList from './components/TaskContent/LetterList';
import PdfFiles from './components/TaskContent/PdfFiles';
import CommentBlock from './components/TaskContent/CommentBlock';

export default class TaskContent extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="task-content">              
                <TaskContentHeader/>
                <PayerBlock/>
                <ActionBlock/>
                <LetterList/>
                <PdfFiles/>
                <CommentBlock/>
            </div>
        )
    }
}