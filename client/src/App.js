import React from 'react';
import { Route, Router } from 'react-router-dom';
import history from './history';
import Header from './components/header/Header';
import LeftMenu from './components/menu/LeftMenu';
import './styles/cc-app.scss';

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            loggedIn: false,
            user: {
                role: 'admin',
                firstName: 'Ezekiel',
                lastName: 'Keator'
            }
        };
    }
    
    render() {
        return (
            <div id="cc-app">
                <Header 
                    user={this.state.user}
                    loggedIn={this.state.loggedIn}
                />
                 <Router history={history}>
                    <LeftMenu 
                        user={this.state.user}
                        history={history}
                    />
                </Router>
            </div>
        );
    }
}
    
export default App;
