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
    const queryParams = ParamsService.getParams();
    this.handlePageChange(this.state.page, queryParams);
  }

  handlePageChange(page, queryParams) {
    this.setState({ page });
    FlowRouter.setParams({ page });

    this.recount(queryParams);
  }

  updateFilters() {
    const filters = ParamsService.getParams();
    this.recount(filters);
    this.setState({
      filters,
      page: 1
    });
  }

  recount = queryParams => {
    const params = ParamsService.getAccountQueryParams();
    Meteor.call(this.method, (err, res) => {
      console.log(err, res);
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
