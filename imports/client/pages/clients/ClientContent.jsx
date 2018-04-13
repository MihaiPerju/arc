import React, {Component} from 'react';
import ClientContentHeader from './components/ClientContent/ClientContentHeader';
import ContactBlock from './components/ClientContent/ContactBlock';
import NoteBlock from './components/ClientContent/NoteBlock';
import ClientEdit from './ClientEdit';

export default class ClientContent extends Component {
    constructor() {
        super();
        this.state = {
            edit: false
        }
    }

    componentWillReceiveProps() {
        this.setState({edit: false})
    }

    setEdit = () => {
        const {edit} = this.state;
        this.setState({edit: !edit})
    };

    render() {
        const {client, setClient} = this.props;
        const {edit} = this.state;
        return (
            <div className="main-content client-content">
                {
                    edit ?
                        <ClientEdit setEdit={this.setEdit} client={client}/> :
                        <div>
                            <ClientContentHeader setClient={setClient} setEdit={this.setEdit} client={client}/>
                            <ContactBlock client={client}/>
                            <NoteBlock/>
                        </div>
                }
            </div>
        )
    }
}