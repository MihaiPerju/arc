import React from "react";
import SortableTableHead from "/imports/client/lib/SortableTableHead.jsx";

export default class ClientHeadList extends React.Component {
    render() {
        const {handleHeaderClick, sortBy, isSortAscend} = this.props;

        return (
            <tr>
                <SortableTableHead
                    title="Client name"
                    headerName="clientName"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <SortableTableHead
                    title="First name"
                    headerName="firstName"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <SortableTableHead
                    title="Last name"
                    headerName="lastName"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <SortableTableHead
                    title="Email"
                    headerName="email"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <th>Actions</th>
            </tr>
        );
    }
}