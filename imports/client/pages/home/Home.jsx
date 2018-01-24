import React from 'react';
import {Header} from 'semantic-ui-react'
import {Container} from 'semantic-ui-react'
import Dashboard from './components/Dashboard';
import RepDashboard from './components/RepDashboard';
import {roleGroups} from "../../../api/users/enums/roles";

export default () => {
    return (
        <main className="cc-main">
            <Container className="page-container">
                <Header textAlign="center" as='h1'>Dashboard</Header>
                {
                    Roles.userIsInRole(Meteor.userId(), roleGroups.ADMIN_TECH_MANAGER)
                        ?
                        <Dashboard/>
                        :
                        <RepDashboard/>
                }
            </Container>
        </main>
    )
}