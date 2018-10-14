import React, { Component } from "react";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import LetterList from "./components/LetterList";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import query from "/imports/api/letters/queries/letterList.js";
import Loading from "/imports/client/lib/ui/Loading";
import PagerService from "../../lib/PagerService";
import Pager from "../../lib/Pager";
import LetterManagementDropzone from "./components/LetterManagementDropzone";
import LetterSearchBar from "./components/LetterSearchBar";
import TagsListQuery from '/imports/api/tags/queries/listTags';
import { moduleNames } from "/imports/client/pages/tags/enums/moduleList";

class LetterListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      create: false,
      page: 1,
      perPage: 13,
      total: 0,
      range: {},
      tags: []
    });
    this.query = query;
  }

  componentWillMount() {
    this.nextPage(0);
    this.getTags();
  }

  componentWillReceiveProps() {
    const { queryParams } = FlowRouter.current();
    if (queryParams.letterIds && queryParams.letterIds == "") {
      this.setPagerInitial();
    }
    this.updatePager();
  }

  createForm = () => {
    this.setState({
      create: true
    });
  };

  closeForm = () => {
    this.setState({
      create: false
    });
  };

  nextPage = inc => {
    const { perPage, total, page } = this.state;
    const nextPage = PagerService.setPage({ page, perPage, total }, inc);
    const range = PagerService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage });
  };

  setPagerInitial = () => {
    this.setState(
      {
        page: 1,
        perPage: 13,
        total: 0
      },
      () => {
        this.nextPage(0);
      }
    );
  };

  updatePager = () => {
    // update the pager count
    const queryParams = PagerService.getParams();
    this.recount(queryParams);
  };

  getTags = () => {
    TagsListQuery
      .clone({
        filters: { entities: { $in: [moduleNames.LETTERS] } }
      })
      .fetch((err,tags) => {
        if (!err) {
          this.setState({ tags });
        }
      });
  };

  render() {
    const { data, isLoading, error } = this.props;
    const { total, range, create,tags } = this.state;
    if (isLoading && !FlowRouter.getQueryParam("letterTemplateName")) {
      return <Loading />;
    }

    if (error) {
      return <div>{error.reason}</div>;
    }
    return (
      <div className="cc-container">
        <div className={create ? "left__side" : "left__side full__width"}>
          <LetterSearchBar
            setPagerInitial={this.setPagerInitial}
            tags={tags}
            hideFilter
          />
          <LetterList letters={data} tags={tags} />
          <PaginationBar
            create={this.createForm}
            closeForm={this.closeForm}
            nextPage={this.nextPage}
            range={range}
            total={total}
            drop
          />
        </div>
        {create && <RightSide create={create} close={this.closeForm} />}
      </div>
    );
  }
}

class RightSide extends Component {
  constructor() {
    super();
    this.state = {
      fade: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ fade: true });
    }, 300);
  }

  render() {
    const {  close } = this.props;
    const { fade } = this.state;

    return (
      <div className={fade ? "right__side in" : "right__side"}>
        <LetterManagementDropzone close={close} />
      </div>
    );
  }
}

export default withQuery(
  () => {
    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;
    return PagerService.setQuery(query, { page, perPage, filters: {} });
  },
  { reactive: true }
)(LetterListContainer);
