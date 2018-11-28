import React from "react";
import TagList from "./components/TagList";
import TagSearchBar from "./components/TagSearchBar";
import PaginationBar from "/imports/client/lib/PaginationBar";
import Notifier from "/imports/client/lib/Notifier";
import Pager from "../../lib/Pager";
import ParamsService from "../../lib/ParamsService";
import { objectFromArray } from "/imports/api/utils";
import TagPanel from "./components/TagPanel";

export default class TagsListContainer extends Pager {
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
      tags: []
    });
    this.method = "tags.count";
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.nextPage(0);

    this.listTags();
    this.pollingMethod = setInterval(() => {
      this.listTags();
    }, 3000);
  }

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

  listTags = () => {
    const params = ParamsService.getTagsParams();
    Meteor.call("tags.get", params, (err, tags) => {
      if (!err) {
        this.setState({ tags });
        this.updatePager();
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  componentWillUnmount() {
    //Removing Interval
    clearInterval(this.pollingMethod);
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
        this.setState({
          tagsSelected: []
        });
      }
    });
  };

  nextPage = inc => {
    const { perPage, total, page } = this.state;
    const nextPage = ParamsService.setPage({ page, perPage, total }, inc);
    const range = ParamsService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage, currentClient: null });
  };

  updatePager = () => {
    // update the pager count
    const queryParams = ParamsService.getTagsParams();
    this.recount(queryParams);
  };

  render() {
    const { tagsSelected, currentTag, create, range, total, tags } = this.state;

    return (
      <div className="cc-container">
        <div
          className={
            currentTag || create ? "left__side" : "left__side full__width"
          }
        >
          <TagSearchBar
            setPagerInitial={this.setPagerInitial}
            btnGroup={tagsSelected.length}
            deleteAction={this.deleteAction}
            hideSort
            hideFilter
          />
          <TagList
            class={
              this.state.filter
                ? "task-list module-tags decreased"
                : "task-list module-tags"
            }
            tagsSelected={tagsSelected}
            selectTag={this.selectTag}
            currentTag={currentTag}
            setTag={this.setTag}
            tags={tags}
          />
          <PaginationBar
            create={this.createForm}
            nextPage={this.nextPage}
            module="Tag Modules"
            range={range}
            total={total}
          />
        </div>
        {(currentTag || create) && (
          <TagPanel
            currentTag={currentTag}
            create={create}
            close={this.closeForm}
          />
        )}
      </div>
    );
  }
}
