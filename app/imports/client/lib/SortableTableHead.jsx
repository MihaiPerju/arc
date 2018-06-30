import React from "react";

export default class FacilityTableHead extends React.Component {
    onHeaderClick = () => {
        const {headerName, handleHeaderClick} = this.props;
        handleHeaderClick(headerName);
    };

    getArrow = () => {
        const {sortBy, isSortAscend, headerName} = this.props;

        if(sortBy === headerName && isSortAscend) {
            return <span>&#8593;</span>;
        } else if (sortBy === headerName && !isSortAscend){
            return <span>&#8595;</span>;
        } else {
            return <span/>;
        }
    };

    render() {
        const {title} = this.props;

        return (
            <th>
                <a href="javascript:;" onClick={this.onHeaderClick}>
                    {title}
                </a>
                {this.getArrow()}
            </th>
        );
    }
}