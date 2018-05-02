import React from 'react';
import {Header, Button} from 'semantic-ui-react';
import {Container} from 'semantic-ui-react';
import {LabelSubstates} from '/imports/api/tasks/enums/substates';
import TaskData from './TaskData';
import SortableTab from './SortableTab';
import {getToken} from '/imports/api/s3-uploads/utils';

const TaskDetails = ({task, updateTask}) => {
    const actionsPerformed = task.actions;
    return (
        <Container className="page-container">
            <Header as="h3" textAlign="center">View Account</Header>
            <TaskData task={task}/>

            <h5>Substate: {task && LabelSubstates[task.substate]}</h5>
            {task && actionsPerformed && actionsPerformed.length
                ?
                <Container>
                    <h4>Actions</h4>
                    <ul>
                        {actionsPerformed.sort((a, b) => a.createdAt < b.createdAt).map((actionPerformed, key) => (
                            <li key={key}><b>{actionPerformed.action.title}</b> Reason: {actionPerformed.reasonCode}</li>
                        ))}
                    </ul>
                </Container>
                :
                <div>
                    <h4>No Actions</h4>
                </div>
            }
            <Header as="h3" textAlign="center">PDF Files</Header>
            <SortableTab updateTask={updateTask} attachments={task && task.attachments}/>
        </Container>)
};

export default TaskDetails;