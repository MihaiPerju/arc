import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Header from './componenets/header/Header';
import './styles/cc-app.scss';

class App extends Component {
    constructor() {
        super();
        
        this.state = {
            loggedIn: false,
            user: {
                role: 'Admin',
                firstName: 'Ezekiel',
                lastName: 'Keator'
            }
        };
    }
    
    render() {
        return (
            <div id="cc-app">
                <Header user={this.state.user} loggedIn={this.state.loggedIn}/>
            </div>
        );
    }
}
    
export default App;
