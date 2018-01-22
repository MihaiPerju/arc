import React from 'react';
import {Container, Card, Icon} from 'semantic-ui-react'
import {Pie} from 'react-chartjs';

const pieData = [
    {
        value: 300,
        color: "#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
    },
    {
        value: 50,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Green"
    },
    {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
    }
];

export default class Dashboard extends React.Component {
    render() {
        return (
            <Container>
                <Card fluid>
                    <Card.Content style={{"textAlign": "center"}}>
                        <Card.Header style={{"textAlign": "center"}}>
                            Dashboard
                        </Card.Header>
                        <Card.Description style={{"textAlign": "left"}}>
                            <p>- Total Accounts On Hold: X</p>
                            <p>- Total Accounts Active: X</p>
                            <p>- Total Accounts Archived: X</p>
                            <p>- Total Accounts This Month: X</p>
                            <p>- Total Accounts This Week: X</p>
                        </Card.Description>
                        <Pie data={pieData}/>
                    </Card.Content>
                </Card>
            </Container>
        )
    }
}