import React, {Component} from 'react';
import ActionHeader from './components/ActionContentHeader';
import ActionEdit from './ActionEdit'

export default class UserContent extends Component {
    constructor() {
        super();
        this.state = {
            edit: false
        }
    }

    setEdit = () => {
        const {edit} = this.state;
        this.setState({edit: !edit})
    };

    render() {
        const {action} = this.props;
        const {edit} = this.state;
        return (
            <div>
                {
                    edit
                        ? <ActionEdit setEdit={this.setEdit} action={action}/>
                        :
                        <ActionHeader setEdit={this.setEdit} action={action}/>
                }
            </div>
        )
    }
}