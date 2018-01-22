import React from 'react';
import {Container, Card, Icon} from 'semantic-ui-react'
import {Pie} from 'react-chartjs';
import query from '/imports/api/tasks/queries/taskList';
import Notifier from '/imports/client/lib/Notifier';
import StateEnum from '/imports/api/tasks/enums/states';

const chartColors = {
    ACTIVE: {
        color: "#147087",
        highlight: "#1889A6"
    },
    ARCHIVED: {
        color: "#57B81E",
        highlight: "#1adb4a"
    },
    HOLD: {
        color: "#363636",
        highlight: "#5A5A5A",
    }
}
export default class Dashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            tasks: [],
            chartData: []
        }
    }

    componentWillMount() {
        query.fetch((err, tasks) => {
            if (!err) {
                this.setState({
                    tasks
                });
                for (key in StateEnum) {
                    let {chartData} = this.state;
                    console.log(key, StateEnum[key], chartColors[key].color);
                    chartData.push({
                        value: this.countAccounts(StateEnum[key]),
                        color: chartColors[key].color,
                        highlight: chartColors[key].highlight,
                        label: StateEnum[key]
                    })
                    this.setState({chartData});
                }
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    countAccounts(state) {
        const {tasks} = this.state;
        let count = 0;
        tasks.forEach((task) => {
            if (task.state === state) {
                count++;
            }
        });
        return count;
    }

    render() {
        const {chartData} = this.state;
        return (
            <Container>
                <Card fluid>
                    <Card.Content style={{"textAlign": "center"}}>
                        <Card.Header style={{"textAlign": "center"}}>
                            Dashboard
                        </Card.Header>
                        <Card.Description style={{"textAlign": "left"}}>
                            <p>- Total Accounts On Hold: {this.countAccounts(StateEnum.HOLD)}</p>
                            <p>- Total Accounts Active: {this.countAccounts(StateEnum.ACTIVE)}</p>
                            <p>- Total Accounts Archived: {this.countAccounts(StateEnum.ARCHIVED)}</p>
                            <p>- Total Accounts This Month: X</p>
                            <p>- Total Accounts This Week: X</p>
                        </Card.Description>
                        <Pie data={chartData}/>
                    </Card.Content>
                </Card>
            </Container>
        )
    }
}