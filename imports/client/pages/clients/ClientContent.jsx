import React, {Component} from 'react';
import ClientContentHeader from './components/ClientContent/ClientContentHeader';
import ContactBlock from './components/ClientContent/ContactBlock';
import NoteBlock from './components/ClientContent/NoteBlock';

export default class ClientContent extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="main-content client-content">              
                <ClientContentHeader/>
                <ContactBlock/>
                <NoteBlock/>
            </div>
        )
    }
}