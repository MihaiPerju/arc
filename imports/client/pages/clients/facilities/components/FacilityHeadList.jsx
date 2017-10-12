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
                    title="Region"
                    headerName="region"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <SortableTableHead
                    title="Address"
                    headerName="address"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <SortableTableHead
                    title="Status"
                    headerName="status"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <th>Actions</th>
            </tr>
        );
    }
}