import React from 'react';
import {Container, Header, Divider, Button, Tab} from 'semantic-ui-react'
import ReportEdit from './ReportEdit';
import ReportSchedule from './ReportSchedule';
import query from '/imports/api/schedules/queries/scheduleList';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';

export default class ReportManage extends React.Component {
    constructor() {
        super();
        this.state = {
            panes: []
        };

        this.query = query.clone();
        this.ScheduleListCont = createQueryContainer(this.query, ReportSchedule, {
            reactive: true
        })
    }

    componentWillMount() {
        const reportId = FlowRouter.current().params.id;
        const ScheduleListCont = this.ScheduleListCont;
        this.setState({
            panes: [
                {menuItem: 'Edit report', render: () => <Tab.Pane><ReportEdit id={reportId}/></Tab.Pane>},
                {menuItem: 'Scheduling', render: () => <Tab.Pane><ScheduleListCont id={reportId}/></Tab.Pane>}
            ]
        })
    }

    render() {
        const {panes} = this.state;
        return (
            <Container className='page-container'>
                <Tab panes={panes}/>
            </Container>
        )
    }
}