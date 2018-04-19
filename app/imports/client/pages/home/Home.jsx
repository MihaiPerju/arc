import React from 'react';
import Dashboard from './components/Dashboard';
import RepDashboard from './components/RepDashboard';
import RoleEnum from "../../../api/users/enums/roles";
import {createContainer} from 'meteor/react-meteor-data';

class Home extends React.Component {
    render() {
        const {currentUser} = this.props;
        return (
            <div className="cc-container home-container">
                <h1>Dashboard</h1>
            </div>
        )
    }
}

export default createContainer(({params}) => {
    const currentUser = Meteor.user();

    return {
        currentUser,
    };
}, Home);