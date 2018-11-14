import React from 'react';
import { Router, Route } from 'react-router-dom';
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
                    <main className="main-section">
                            <LeftMenu 
                                user={this.state.user}
                            />
                            <Route 
                                path={'/code/list'}
                                render={props => {
                                    return(
                                        <div className='main-content'>
                                        <div className="cc-container">
                                            <div className="left__side full__width">
                                                Hi
                                            </div>
                                        </div>
                                        </div>
                                    )
                                }}
                            />
                    </main>
                </Router>
            </div>
        );
    }
}
    
export default App;
