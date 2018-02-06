import React, {Component} from 'react'
import TaskList from './components/TaskList.jsx';
import TaskBar from './components/TaskBar.jsx';
import PaginationBar from './components/PaginationBar.jsx';
import TaskContent from './TaskContent.jsx';

export default class TaskListContainer extends Component {
    constructor() {
        super();
    }
        
    render() {
        return (
            <div className="task-container">
                <div className="left__side">
                    <TaskBar/>
                    <TaskList/>
                    <PaginationBar/>
                </div>
                <div className="right__side">
                    <TaskContent/>
                </div>
            </div>
        );
    }
}