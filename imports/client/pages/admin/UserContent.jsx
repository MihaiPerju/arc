import React, {Component} from 'react';
import {getImagePath} from "/imports/api/utils";
import UserContentHeader from './components/UserContentHeader';
import EditUser from './EditUser';

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
        const {user} = this.props;
        const {edit} = this.state;
        return (
            <div className="main-content flex-content user-content">
                {
                    edit ?
                        <EditUser  setEdit={this.setEdit} user={user}/>
                        :
                        <UserContentHeader setEdit={this.setEdit} user={user}/>
                }
            </div>
        )
    }
}