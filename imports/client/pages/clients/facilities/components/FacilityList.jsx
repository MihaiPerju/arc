import React from 'react';
import Loading from "/imports/client/lib/ui/Loading.jsx";
import FacilityRow from "./FacilityRow.jsx";
import FacilityHeadList from "./FacilityHeadList";

export default class FacilityList extends React.Component {
    render() {
        const {data, loading, error, handleHeaderClick, sortBy, isSortAscend} = this.props;

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
                    <FacilityHeadList sortBy={sortBy}
                                      isSortAscend={isSortAscend}
                                      handleHeaderClick={handleHeaderClick}/>
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