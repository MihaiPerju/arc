import React, { Component } from "react";
import TagList from "./components/TagList";
import TagSearchBar from "./components/TagSearchBar";
import PaginationBar from "/imports/client/lib/PaginationBar";
import TagContent from "./TagContent";
import TagCreate from "./TagCreate";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import clientsQuery from "../../../api/clients/queries/listClients";
import tagsQuery from "/imports/api/tags/queries/listTags";
import Loading from "/imports/client/lib/ui/Loading";
import { objectFromArray } from "/imports/api/utils";
import Notifier from "/imports/client/lib/Notifier";
import Pager from "../../lib/Pager";
import PagerService from "../../lib/PagerService";

class TagListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      tagsSelected: [],
      currentTag: null,
      create: false,
      page: 1,
      perPage: 13,
      total: 0,
      range: {},
      clients: [],
      loadingClients: true
    });
    this.query = tagsQuery;
  }

  componentWillMount() {
    this.nextPage(0);
    clientsQuery.fetch((err, clients) => {
      if (!err) {
        this.setState({
          clients,
          loadingClients: false
        });
      }
    });
  }

  componentWillReceiveProps(newProps) {
    this.updatePager();
  }

  showFilterBar() {
    this.setState({
      filter: !this.state.filter
    });
  }

  setTag = _id => {
    const { currentTag } = this.state;

    if (currentTag === _id) {
      this.setState({ currentTag: null });
    } else {
      this.setState({ currentTag: _id, create: false });
    }
  };

  selectTag = _id => {
    const { tagsSelected } = this.state;
    if (tagsSelected.includes(_id)) {
      tagsSelected.splice(tagsSelected.indexOf(_id), 1);
    } else {
      tagsSelected.push(_id);
    }
    this.setState({ tagsSelected });
  };

  createForm = () => {
    this.setState({
      currentTag: false,
      create: true,
      rightSide: true
    });
  };

  closeForm = () => {
    this.setState({
      create: false
    });
    this.updatePager();
  };

  deleteAction = () => {
    const { tagsSelected } = this.state;

    Meteor.call("tags.deleteMany", tagsSelected, err => {
      if (!err) {
        Notifier.success("Tags deleted !");
      }
    });
  };

  nextPage = inc => {
    const { perPage, total, page } = this.state;
    const nextPage = PagerService.setPage({ page, perPage, total }, inc);
    const range = PagerService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentClient: null });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = PagerService.getParams();
    this.recount(queryParams);
  };

  render() {
    const { data, loading, error } = this.props;
    const {
      tagsSelected,
      currentTag,
      create,
      range,
      total,
      clients,
      loadingClients
    } = this.state;
    const tag = objectFromArray(data, currentTag);

    if (loading || loadingClients) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error.reason}</div>;
    }
    return (
      <div className="cc-container">
        <div
          className={
            currentTag || create ? "left__side" : "left__side full__width"
          }
        >
          <TagSearchBar
            btnGroup={tagsSelected.length}
            deleteAction={this.deleteAction}
          />
          <TagList
            class={this.state.filter ? "task-list decreased" : "task-list"}
            tagsSelected={tagsSelected}
            selectTag={this.selectTag}
            currentTag={currentTag}
            setTag={this.setTag}
            tags={data}
          />
          <PaginationBar
            create={this.createForm}
            nextPage={this.nextPage}
            module="Tag"
            range={range}
            total={total}
          />
        </div>
        {(currentTag || create) && (
          <RightSide
            tag={tag}
            create={create}
            close={this.closeForm}
            clients={clients}
          />
        )}
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
    const { fade } = this.state;
    const { tag, create, close, clients } = this.props;
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {create ? (
          <TagCreate clients={clients} close={close} />
        ) : (
          <TagContent clients={clients} tag={tag} />
        )}
      </div>
    );
  }
}

export default withQuery(
  props => {
    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;
    return PagerService.setQuery(tagsQuery, { page, perPage, filters: {} });
  },
  { reactive: true }
)(TagListContainer);
