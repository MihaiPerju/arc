import React from 'react';
import {Container, Grid, Card} from 'semantic-ui-react'
import Notifier from '/imports/client/lib/Notifier';

export default class RepDashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            tasks: {
                active: [],
                hold: []
            }
        }
    }

    componentWillMount() {
        Meteor.call('tasks.get', (err, tasks) => {
            if (!err) {
                this.setState({tasks});
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    render() {
        const {tasks} = this.state;
        return (
            <Container>
                <Card fluid>
                    <Card.Content style={{"textAlign": "center"}}>
                        <Card.Header>
                            <h2>Tasks</h2>
                        </Card.Header>
                        <Card.Description>
                            <h2>Active</h2>
                            <Grid columns={4} stretched>
                                {
                                    tasks.active.map((task, index) => {
                                        return (
                                            <Grid.Column key={index}>
                                                <a href={"/task/" + task._id + "/view"}>{task._id}</a>
                                            </Grid.Column>
                                        )
                                    })
                                }
                            </Grid>
                            <h2>On hold</h2>
                            <Grid columns={4} stretched>
                                {
                                    tasks.hold.map((task, index) => {
                                        return (
                                            <Grid.Column key={index}>
                                                <a href={"/task/" + task._id + "/view"}>{task._id}</a>
                                            </Grid.Column>
                                        )
                                    })
                                }
                            </Grid>
                        </Card.Description>
                    </Card.Content>
                </Card>
            </Container>
        )
    }
}