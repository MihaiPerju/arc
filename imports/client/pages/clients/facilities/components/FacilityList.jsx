import React from 'react';
import Loading from "/imports/client/lib/ui/Loading.jsx";
import FacilityRow from "./FacilityRow.jsx";

export default class FacilityList extends React.Component {
    render() {
        const {data, loading, error} = this.props;

        if (loading) {
            return <Loading/>;
        }

        if (error) {
            return <div>Error: {error.reason}</div>;
        }


        return (
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>Facility Name</th>
                        <th>State</th>
                        <th>Region</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {!data.length
                        ? <p>There are no facilities</p>
                        :
                        data.map(facility => (
                            <FacilityRow key={facility._id} facility={facility}/>
                        ))
                    }
                    </tbody>
                </table>

            </div>
        );
    }
}