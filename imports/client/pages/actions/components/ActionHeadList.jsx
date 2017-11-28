import React from "react";
import SortableTableHead from "/imports/client/lib/SortableTableHead.jsx";

export default class ActionHeadList extends React.Component {
    render() {
        const {handleHeaderClick, sortBy, isSortAscend} = this.props;

        return (
            <tr>
                <SortableTableHead
                    title="Title"
                    headerName="title"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <th>Description</th>
                <th>Substates</th>
                <th>Actions</th>
            </tr>
        );
    }
}