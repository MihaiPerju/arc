import React from 'react';
import {Header} from 'semantic-ui-react';
import {Container, Button} from 'semantic-ui-react';
import {path, getToken} from '/imports/api/s3-uploads/utils';
import {LabelSubstates} from '/imports/api/tasks/enums/substates';
import TaskData from './TaskData';

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
                    {task.actionsLinkData.sort((a, b) => a.createdAt < b.createdAt).map((action, key) => (
                        <div key={key}><h6>{action.title}</h6></div>
                    ))}

                </Container>
                :
                <div>
                    <h4>No Actions</h4>
                </div>
            }
            <Header as="h3" textAlign="center">PDF Files</Header>
            {
                task && task.attachments &&
                task.attachments.map((pdf, index) => {
                    return (
                        <div>
                            <a key={index} target="_blank"
                               href={path(pdf.path)}>
                                {pdf.name.slice(0, pdf.name.indexOf('.'))}
                            </a>
                        </div>
                    )
                })
            }
        </Container>
    )
};

export default TaskDetails;
