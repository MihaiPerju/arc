import React from 'react';
import {Container, Header} from 'semantic-ui-react';
import Loading from "/imports/client/lib/ui/Loading.jsx";
import Notifier from '/imports/client/lib/Notifier';

export default class LetterView extends React.Component {
    constructor() {
        super();

        this.state = {
            letter: null,
            loading: true
        };
    }

    componentDidMount() {
        this.getLetter();
    }

    getLetter = () => {
        const {letterId} = FlowRouter.current().params;
        Meteor.call('letter.get', letterId, (err, letter) => {
            if (err) {
                return Notifier.error('Error while getting letter!');
            } else {
                this.setState({
                    letter,
                    loading: false
                });
            }
        });
    };

    render() {
        const {loading, letter} = this.state;

        if (loading) {
            return <Loading/>;
        }

        return (
            <Container className="page-container">
                <Header as="h2" textAlign="center">Letter ID: {letter._id}</Header>
                <div dangerouslySetInnerHTML={{__html: letter.body}}/>
            </Container>
        );
    }
}