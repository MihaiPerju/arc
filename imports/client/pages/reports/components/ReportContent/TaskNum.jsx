import React, {Component} from 'react';
import TaskContentHeader from './TaskContentHeader';
import PayerBlock from './PayerBlock';

export default class TaskNum extends Component {
    render() {
        const { taskNum, client } = this.props;
        
        return (
            <div className="task-num-block">
                <h6 className="text-light-grey">Task nr. {taskNum}</h6>
                <TaskContentHeader client={client}/>
                <PayerBlock/>
            </div>
        )
    }
}