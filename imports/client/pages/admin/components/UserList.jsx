import React, {Component} from 'react';
import _ from 'underscore';
import UserSingle from './UserSingle.jsx';

export default class UserList extends Component {
    render() {
        const {data, loading, error} = this.props;

        if (loading) {
            return <div>Loading</div>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }

        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                        {_.map(data, (user, idx) => {
                            return <UserSingle user={user} key={idx}/>;
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}