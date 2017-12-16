import React from 'react';
import {Container, Header, Divider, Button, Tab} from 'semantic-ui-react'
import ReportEdit from './ReportEdit';
import ReportSchedule from './ReportSchedule';

export default class ReportManage extends React.Component {
    constructor() {
        super();
        this.state = {
            panes: []
        }
    }

    componentWillMount() {
        const reportId = FlowRouter.current().params.id;
        this.setState({
            panes: [
                {menuItem: 'Edit report', render: () => <Tab.Pane><ReportEdit id={reportId}/></Tab.Pane>},
                {menuItem: 'Scheduling', render: () => <Tab.Pane><ReportSchedule/></Tab.Pane>}
            ]
        })
    }

    render() {
        const {panes} = this.state;
        return (
            <Container className='page-container'>
                <Header as="h2" textAlign="center">
                    Edit report
                </Header>
                <Tab panes={panes}/>
            </Container>
        )
    }
}