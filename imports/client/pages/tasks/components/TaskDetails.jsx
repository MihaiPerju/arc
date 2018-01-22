import React from 'react';
import {Header, Button} from 'semantic-ui-react';
import {Container} from 'semantic-ui-react';
import {LabelSubstates} from '/imports/api/tasks/enums/substates';
import TaskData from './TaskData';
import SortableTab from './SortableTab';
import {getToken} from '/imports/api/s3-uploads/utils';

const TaskDetails = ({task}) => {
    return (
        <Container className="page-container">
            <Header as="h3" textAlign="center">View Task</Header>
            <TaskData task={task}/>
            {
                task && task.attachments && task.attachments.length > 1 &&
                <Button href={"/pdfs/" + task._id + "/" + getToken()} target="_blank">
                    Download All PDFs
                </Button>
            }
            <h5>Substate: {task && LabelSubstates[task.substate]}</h5>
            {task && task.actionsLinkData && task.actionsLinkData.length
                ?
                <Container>
                    <h4>Actions</h4>
                    <ul>
                        {task.actionsLinkData.sort((a, b) => a.createdAt < b.createdAt).map((action, key) => (
                            <li key={key}>{action.title}</li>
                        ))}
                    </ul>
                </Container>
                :
                <div>
                    <h4>No Actions</h4>
                </div>
            }
            <Header as="h3" textAlign="center">PDF Files</Header>
            <SortableTab attachments={task && task.attachments}/>
        </Container>)
};

export default TaskDetails;