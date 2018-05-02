import React from "react";
import SortableTableHead from "/imports/client/lib/SortableTableHead.jsx";

export default class CodeHeadList extends React.Component {
    render() {
        const {handleHeaderClick, sortBy, isSortAscend} = this.props;

        return (
            <tr>
                <SortableTableHead
                    title="CARC/RARC Code"
                    headerName="code"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <SortableTableHead
                    title="PMS Action"
                    headerName="action"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <SortableTableHead
                    title="Type"
                    headerName="type"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <SortableTableHead
                    title="Description"
                    headerName="description"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <SortableTableHead
                    title="Short Description"
                    headerName="description_short"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <SortableTableHead
                    title="Denial Action"
                    headerName="denial_action"
                    sortBy={sortBy}
                    isSortAscend={isSortAscend}
                    handleHeaderClick={handleHeaderClick}/>
                <th>Actions</th>
            </tr>
        );
    }
}