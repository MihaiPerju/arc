import React, {Component} from 'react';
import _ from 'underscore';
import ClientSingle from './ClientSingle.jsx';
import ClientHeadList from './ClientHeadList';

export default class ClientList extends Component {
    render() {
        const {data, loading, error, handleHeaderClick, sortBy, isSortAscend} = this.props;

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
                                    <ClientHeadList sortBy={sortBy}
                                                    isSortAscend={isSortAscend}
                                                    handleHeaderClick={handleHeaderClick}/>/>
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