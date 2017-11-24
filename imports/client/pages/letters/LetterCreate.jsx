import React from "react";
import {Container} from 'semantic-ui-react';
import {Header} from 'semantic-ui-react';

export default class LetterCreate extends React.Component {
    render() {
        const {taskId} = this.props;

        return (
            <Container>
                <Header as="h3" textAlign="center">Letter</Header>
            </Container>
        );
    }
}