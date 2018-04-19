import React from 'react';
import {Container, Card, Grid} from 'semantic-ui-react'
import {Pie} from 'react-chartjs';
import Notifier from '/imports/client/lib/Notifier';

export default class   Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            data: []
        }
    }

    componentWillMount() {
        Meteor.call('tasks.count', (err, data) => {
            if (!err) {
                this.setState({data});
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    getChartData(facility) {
        return [
            {
                value: facility.active,
                color: "#147087",
                highlight: "#1889A6",
                label: "Active"
            },
            {
                value: facility.hold,
                color: "#363636",
                highlight: "#5A5A5A",
                label: "Hold"
            }
        ];
    }

    render() {
        const {data} = this.state;
        return (
            <Container>
                {
                    data && data.map((facility) => {
                        return (
                            <Card fluid>
                                <Card.Content style={{"textAlign": "center"}}>
                                    <Card.Header>
                                        <h2>{facility.name}</h2>
                                        <Grid>
                                            <Grid.Column>
                                                <h4>Total Active</h4>
                                                <p style={{"fontSize": "50"}}> {facility.active}</p>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <h4>Total Archived</h4>
                                                <p style={{"fontSize": "50"}}> {facility.archived} </p>

                                            </Grid.Column>
                                            <Grid.Column>
                                                <h4>On hold</h4>
                                                <p style={{"fontSize": "50"}}>  {facility.hold}</p>

                                            </Grid.Column>
                                            <Grid.Column>
                                                <h4>This month</h4>
                                                <p style={{"fontSize": "50"}}>  {facility.currentMonth}</p>

                                            </Grid.Column>
                                            <Grid.Column>
                                                <h4>This week</h4>
                                                <p style={{"fontSize": "50"}}>  {facility.currentWeek}</p>

                                            </Grid.Column>
                                        </Grid>
                                    </Card.Header>
                                    <Card.Description>
                                        <Pie data={this.getChartData(facility)} width="600" height="250"/>
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        )
                    })
                }
            </Container>
        )
    }
}