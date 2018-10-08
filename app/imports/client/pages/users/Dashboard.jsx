import React from 'react';
import {Container, Header} from 'semantic-ui-react'

export default class Dashboard extends React.Component {
    render() { 
    return (
        <main className="cc-main">
            <Container className="page-container">
                <Header textAlign="center" as='h1'>Dashboard</Header>
            </Container>
        </main>
    )
    }
}