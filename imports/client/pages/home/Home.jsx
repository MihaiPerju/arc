import React from 'react';
import {Header} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import Dashboard from './components/Dashboard';

export default () => {
    return (
        <main className="cc-main">
            <Container className="page-container">
                <Header textAlign="center" as='h1'>Home</Header>
                <Dashboard/>
            </Container>
        </main>
    )
}