import React, { Component } from "react";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import LetterList from "./components/LetterList";
import ParamsService from "../../lib/ParamsService";
import Pager from "../../lib/Pager";
import LetterManagementDropzone from "./components/LetterManagementDropzone";
import LetterSearchBar from "./components/LetterSearchBar";
import { moduleNames } from "/imports/api/tags/enums/tags";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class LetterListContainer extends Pager {
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
    this.method = "letters.count";
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.nextPage(0);
    this.getTags();

    this.pollingMethod = setInterval(() => {
      this.listLetters();
    }, 3000);
  }

  listLetters = () => {
    const params = ParamsService.getLettersParams();
    Meteor.call("letters.list", params, (err, letters) => {
      if (!err) {
        this.setState({ letters });
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
    const nextPage = ParamsService.setPage({ page, perPage, total }, inc);
    const range = ParamsService.getRange(nextPage, perPage);
    FlowRouter.setQueryParams({ page: nextPage });
    this.setState({ range, page: nextPage });

    this.listLetters();
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
    const queryParams = ParamsService.getLettersParams();
    this.recount(queryParams);
  };

  getTags = () => {
    Meteor.call(
      "tags.get",
      { entities: { $in: [moduleNames.LETTERS] } },
      (err, tags) => {
        if (!err) {
          this.setState({ tags });
        } else {
          Notifier.error(err.reason);
        }
      }
    );
  };

  render() {
    const { total, range, create, tags, letters } = this.state;

    if (!letters) {
      return <Loading />;
    }

    return (
      <div className="cc-container">
        <div className={create ? "left__side" : "left__side full__width"}>
          <LetterSearchBar
            setPagerInitial={this.setPagerInitial}
            tags={tags}
            hideFilter
          />
          <LetterList letters={letters} tags={tags} />
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
    const { close } = this.props;
    const { fade } = this.state;

    return (
      <div className={fade ? "right__side in" : "right__side"}>
        <LetterManagementDropzone close={close} />
      </div>
    );
  }
}
