import React from 'react';
import Dashboard from './components/Dashboard';
import RepDashboard from './components/RepDashboard';
import RoleEnum from "../../../api/users/enums/roles";
import {createContainer} from 'meteor/react-meteor-data';

class Home extends React.Component {
    render() {
        const {currentUser} = this.props;
        return (
            <main className="cc-main">
                <div className="page-container">
                    <div className="text-center"><h1>Dashboard</h1></div>
                    {
                        currentUser && currentUser.roles && currentUser.roles.includes(RoleEnum.REP)
                            ?
                            <RepDashboard/>
                            :
                            <Dashboard/>
                    }
                </div>
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