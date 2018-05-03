import React from 'react';
import Notifier from '/imports/client/lib/Notifier';
import {EJSON} from 'meteor/ejson'
import taskQuery from '/imports/api/tasks/queries/taskList';
import {Divider, Container, Header} from 'semantic-ui-react';
import TaskData from '/imports/client/pages/tasks/components/TaskData';

export default class ReportView extends React.Component {
    constructor() {
        super();
        this.state = {
            tasks: []
        };
    }

    componentWillMount() {
        const {id} = this.props;

        Meteor.call("report.getById", id, (err, report) => {
            if (!err) {
                const filters = EJSON.parse(report.mongoFilters);
                taskQuery.clone({filters}).fetch((err, tasks) => {
                    if (!err) {
                        this.setState({
                            tasks
                        })
                    } else {
                        Notifier.error(err.reason);
                    }
                })
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    render() {
        const {tasks} = this.state;
        return (
            <Container>
                {
                    tasks.map((task, index) => {
                        return <div>
                            <Header textAlign="center">Task No.{index + 1}</Header>
                            <TaskData task={task} key={index}/>
                            <Divider/>
                        </div>
                    })
                }
            </Container>
        )
    }
}