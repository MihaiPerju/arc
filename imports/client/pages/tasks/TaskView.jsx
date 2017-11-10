import React from 'react';
import Loading from "/imports/client/lib/ui/Loading.jsx";
import query from '/imports/api/tasks/queries/taskList';
import TaskViewContainer from './components/TaskViewContainer';

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
        if (loading) {
            return <Loading/>;
        } else return (
            <TaskViewContainer task={task}/>
        );
    }
}