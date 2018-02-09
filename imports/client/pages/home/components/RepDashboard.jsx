import React from 'react';
import {Container, Grid, Card} from 'semantic-ui-react'
import Notifier from '/imports/client/lib/Notifier';

export default class RepDashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            tasks: {
                active: 0,
                hold: 0
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
                            <h2>Accounts</h2>
                        </Card.Header>
                        <Card.Description>
                            <Grid columns={4} stretched>
                                <Grid.Column>
                                    <h2>Active</h2>
                                    <p style={{"fontSize": "50"}}> {tasks.active}</p>
                                </Grid.Column>
                                <Grid.Column>
                                    <h2>Hold</h2>
                                    <p style={{"fontSize": "50"}}> {tasks.hold}</p>
                                </Grid.Column>
                            </Grid>
                        </Card.Description>
                    </Card.Content>
                </Card>
            </Container>
        )
    }
}