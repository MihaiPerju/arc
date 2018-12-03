import React from "react";
import Pagination from "react-js-pagination";
import ParamsService from "./ParamsService";

export default class Pager extends React.Component {
  constructor() {
    super();
    this.state = {
      page: parseInt(FlowRouter.getParam("page")) || 1,
      perPage: 10,
      total: 0,
      filters: {}
    };
  }

  componentDidMount() {
    const params = ParamsService.getParams();
    this.handlePageChange(this.state.page, params);
  }

  handlePageChange(page, params) {
    this.setState({ page });
    FlowRouter.setParams({ page });

    this.recount(params);
  }

  updateFilters() {
    const filters = ParamsService.getParams();
    this.recount(filters);
    this.setState({
      filters,
      page: 1
    });
  }

  recount = params => {
    Meteor.call(this.method, params, (err, total) => {
      this.setState({ total });
    });
  };

  getPaginator() {
    return (
      this.state.total > this.state.perPage && (
        <Pagination
          activePage={this.state.page}
          itemsCountPerPage={this.state.perPage}
          totalItemsCount={this.state.total}
          pageRangeDisplayed={5}
          onChange={this.handlePageChange.bind(this)}
        />
      )
    );
  }
}
