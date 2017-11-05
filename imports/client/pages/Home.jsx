import React from 'react';
import {Header} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'

export default () => {
    return (
        <main className="cc-main">
            <Container className="page-container">
                <Header textAlign="center" as='h1'>Home</Header>
            </Container>
        </main>
    )
}