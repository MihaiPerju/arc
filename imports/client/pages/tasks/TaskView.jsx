import React from 'react';
import Loading from "/imports/client/lib/ui/Loading.jsx";
import query from '/imports/api/tasks/queries/taskList';
import TaskViewContainer from './components/TaskViewContainer';
import DropzoneComponent from 'react-dropzone-component';
import Notifier from '/imports/client/lib/Notifier';
import {Container} from 'semantic-ui-react'
import { getToken } from '/imports/api/s3-uploads/utils';

export default class TaskView extends React.Component {
    constructor() {
        super();

        this.state = {
            task: null,
            loading: true
        };
    }

    componentDidMount() {
        this.getTask();
    }

    getTask = () => {
        const {_id} = this.props;
        query.clone({filters: {_id}}).fetchOne((err, task) => {
            if (err) {
                return Notifier.error('Error while getting task!');
            }

            this.setState({
                task,
                loading: false
            })
        })
    };

    render() {
        const {loading, task} = this.state;
        const componentConfig = {
            postUrl: `/uploads/task-pdf/`+ getToken()
        };

        const djsConfig = {
            complete(file) {
                Notifier.success('Added');
                this.removeFile(file);
            }
        };

        if (loading) {
            return <Loading/>;
        } else return (
            <Container>
                <TaskViewContainer task={task}/>
                <DropzoneComponent config={componentConfig} djsConfig={djsConfig}/>
            </Container>
        );
    }
}