import React from 'react';
import Pagination from 'react-js-pagination';

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            page: parseInt(FlowRouter.getParam('page')) || 1,
            perPage: 10,
            total: 0,
            filters: {}
        };
    }

    componentDidMount() {
        this.handlePageChange(this.state.page);
    }

    getQuery() {
        return this.query;
    }

    handlePageChange(page) {
        this.setState({page});

        FlowRouter.setParams({page});

        this.recount();
    }

    updateFilters(filters) {
        this.getQuery().setParams(filters);

        this.recount();
        this.setState({
            filters,
            page: 1
        });

    }

    recount() {
        this.getQuery().getCount((err, res) => {
            this.setState({total: res});
        })
    }

    getPagerOptions() {
        return {
            limit: this.state.perPage,
            skip: this.state.perPage * (this.state.page - 1)
        };
    }

    getPaginator() {
        return this.state.total > this.state.perPage && <Pagination
            activePage={this.state.page}
            itemsCountPerPage={this.state.perPage}
            pageRangeDisplayed={5}
            onChange={this.handlePageChange.bind(this)}
        />
    }

    onFilter(ref) {
        return (value) => {
            let filters = this.state.filters;

            _.extend(filters, {
                [ref]: value
            });

            this.updateFilters(filters);
        }
    }
};