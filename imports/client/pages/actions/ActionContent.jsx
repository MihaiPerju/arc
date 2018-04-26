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

    componentWillReceiveProps() {
        this.setState({edit: false})
    }

    setEdit = () => {
        const {edit} = this.state;
        this.setState({edit: !edit})
    };

    render() {
        const {action, subStates} = this.props;
        const {edit} = this.state;
        return (
            <div className="section-action">
                {
                    edit
                        ? <ActionEdit setEdit={this.setEdit} subStates={subStates} action={action}/>
                        :
                        <ActionHeader setEdit={this.setEdit} action={action}/>
                }
            </div>
        )
    }
}