import React from 'react';
import Loading from "/imports/client/lib/ui/Loading.jsx";
import query from '/imports/api/tasks/queries/taskList';
import TaskDetails from './TaskDetails.jsx';
import DropzoneComponent from 'react-dropzone-component';
import {Divider} from 'semantic-ui-react'
import CommentsListContainer from '/imports/client/pages/comments/CommentsListContainer';
import {getToken} from '/imports/api/s3-uploads/utils';
import SelectActionsContainer from './SelectActionsContainer';
import {AutoForm} from 'uniforms-semantic';
import {Button} from 'semantic-ui-react';
import {Container} from 'semantic-ui-react';
import {Header} from 'semantic-ui-react';
import Notifier from '/imports/client/lib/Notifier';
import SimpleSchema from 'simpl-schema';

const ActionSchema = new SimpleSchema({
    action: {
        type: String,
        optional: true
    }
});

export default class TaskView extends React.Component {
    constructor() {
        super();

        this.state = {
            task: null,
            loading: true
        };
    }

    componentWillMount() {
        this.getTask();
    }

    getTask = () => {
        const {taskId} = this.props;
        query.clone({filters: {_id: taskId}}).fetchOne((err, task) => {
            if (err) {
                return Notifier.error('Error while getting task!');
            }

            this.setState({
                task,
                taskId: task._id,
                loading: false
            })
        })
    };

    onSubmit = (data) => {
        const {taskId} = this.props;

        Meteor.call('task.actions.add', taskId, data.action.value
            , (err) => {
                if (!err) {
                    location.reload();
                    Notifier.success("Data saved");
                } else {
                    Notifier.error(err.reason);
                }
            })
    };

    render() {
        const {loading, task} = this.state;
        const {taskId} = this.props;
        const componentConfig = {
            postUrl: `/uploads/task-pdf/` + taskId + '/' + getToken()
        };

        const djsConfig = {
            complete(file) {
                Notifier.success('Added');
                this.removeFile(file);
            },
            acceptedFiles: '.pdf'
        };

        if (loading) {
            return <Loading/>;
        } else return (
            <Container>
                    <TaskDetails task={task}/>
                    <DropzoneComponent config={componentConfig} djsConfig={djsConfig}/>
                    <Divider/>
                    <CommentsListContainer taskId={task && task._id}/>

                    <Container className="page-container">
                            <Header as="h2" textAlign="center">Add Action</Header>

                            <AutoForm schema={ActionSchema} onSubmit={this.onSubmit} ref="form">
                                    <SelectActionsContainer/>

                                    <Divider/>

                                    <Button primary fluid type="submit">
                                            Save
                                    </Button>
                            </AutoForm>
                    </Container>
            </Container>
        );
    }
}
