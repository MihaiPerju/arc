import React from 'react';
import { Route } from 'react-router-dom';
import Header from './components/header/Header';
import Menu from './components/menu/LeftMenu';
import './styles/cc-app.scss';
import LeftMenu from './components/menu/LeftMenu';

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
                <LeftMenu 
                    user={this.state.user}
                />
            </div>
        );
    }
}
    
export default App;
