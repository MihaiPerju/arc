import React, {Component} from 'react';
import ReportHeader from './components/ReportContent/ReportHeader';
import TaskNum from './components/ReportContent/TaskNum';

export default class ReportContent extends Component {
    constructor() {
        super();
    }

    render() {
        const tasks = [
            { client: 'Claudio Steel' },
            { client: 'Olimen limen' }
        ];
        const taskList = tasks.map(function(task, index){
            return (
                <TaskNum
                    key={index}
                    taskNum={index + 1}
                />
            )
        })
        return (
            <div className="main-content report-content">
                <ReportHeader/>
                { taskList }
            </div>
        )
    }
}