import React from 'react';
import {Header} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import Dashboard from './components/Dashboard';
import RepDashboard from './components/RepDashboard';
import RoleEnum from "../../../api/users/enums/roles";
import {createContainer} from 'meteor/react-meteor-data';

class Home extends React.Component {
    render() {
        const {currentUser} = this.props;
        return (
            <main className="cc-main">
                <Container className="page-container">
                    <Header textAlign="center" as='h1'>Dashboard</Header>
                    {
                        currentUser && currentUser.roles && currentUser.roles.includes(RoleEnum.REP)
                            ?
                            <RepDashboard/>
                            :
                            <Dashboard/>
                    }
                </Container>
            </main>
        )
    }
}

export default createContainer(({params}) => {
    const currentUser = Meteor.user();

    return {
        currentUser,
    };
}, Home);