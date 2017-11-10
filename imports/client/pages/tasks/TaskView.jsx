import React from 'react';
import moment from 'moment';
import {Header} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import Loading from "/imports/client/lib/ui/Loading.jsx";
import query from '/imports/api/tasks/queries/taskList';

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
        const {_id} = FlowRouter.current().params;
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
        }

        return (
            <Container className="page-container">

                <Header as="h3" textAlign="center">View Task</Header>
                <h5>AcctNum: {task && task.acctNum}</h5>
                <h5>FacCode: {task && task.facCode}</h5>
                <h5>PtType: {task && task.ptType}</h5>
                <h5>PtName: {task && task.ptName}</h5>
                <h5>DischrgDate: {task && task.dischrgDate}</h5>
                <h5>FbDate: {task && task.fbDate}</h5>
                <h5>AcctBal: {task && task.acctBal}</h5>
                <h5>FinClass: {task && task.finClass}</h5>
                <h5>AdmitDate: {task && task.admitDate}</h5>
                <h5>MedNo: {task && task.medNo}</h5>
                <h5>InsName: {task && task.insName}</h5>
                <h5>InsName2: {task && task.insName2}</h5>
                <h5>InsName3: {task && task.insName3}</h5>
                <h5>InsCode: {task && task.insCode}</h5>
                <h5>InsCode2: {task && task.insCode2}</h5>
                <h5>InsCode3: {task && task.insCode3}</h5>
                <h5>InsBal: {task && task.insBal}</h5>
                <h5>InsBal2: {task && task.insBal2}</h5>
                <h5>InsBal3: {task && task.insBal3}</h5>
                <h5>State: {task && task.state}</h5>

            </Container>
        );
    }
}