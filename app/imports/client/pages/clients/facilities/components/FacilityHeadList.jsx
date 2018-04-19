import React from "react";
import SortableTableHead from "/imports/client/lib/SortableTableHead.jsx";

export default class FacilityHeadList extends React.Component {
    render() {
        const {handleHeaderClick, sortBy, isSortAscend} = this.props;

        return (
            <tr>
                <SortableTableHead
                    title="Facility Name"
                    headerName="name"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <SortableTableHead
                    title="State"
                    headerName="state"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <SortableTableHead
                    title="City"
                    headerName="city"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <th>Region</th>
                <SortableTableHead
                    title="Zip code"
                    headerName="zipCode"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <SortableTableHead
                    title="First address"
                    headerName="addressOne"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <SortableTableHead
                    title="Second address"
                    headerName="addressTwo"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        );
    }
}