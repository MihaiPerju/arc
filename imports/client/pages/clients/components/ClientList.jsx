import React, {Component} from 'react';
import _ from 'underscore';
import ClientSingle from './ClientSingle.jsx';

export default class ClientList extends Component {
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
                    {
                        data.length
                            ?
                            <div>
                                <tr>
                                    <th>Client name</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                                {_.map(data, (client, idx) => {
                                    return <ClientSingle client={client} key={idx}/>;
                                })}
                            </div>
                            :
                            <div>
                                There are no clients
                            </div>
                    }

                    </tbody>
                </table>
            </div>
        );
    }
}