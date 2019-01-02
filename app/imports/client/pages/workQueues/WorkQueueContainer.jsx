import React from "react";
import WorkQueueList from "./components/WorkQueueList";
import WorkQueueSearchBar from "./components/WorkQueueSearchBar";
import PaginationBar from "/imports/client/lib/PaginationBar";
import Notifier from "/imports/client/lib/Notifier";
import Pager from "../../lib/Pager";
import ParamsService from "../../lib/ParamsService";
import WorkQueuePanel from "./components/WorkQueuePanel";
import Loading from "/imports/client/lib/ui/Loading";

export default class WorkQueuesListContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      workQueuesSelected: [],
      currentWorkQueue: null,
      create: false,
      page: 1,
      perPage: 13,
      total: 0,
      range: {}
    });
    this.method = "workQueues.count";
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.nextPage(0);

    this.pollingMethod = setInterval(() => {
      this.listWorkQueues();
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

  listWorkQueues = () => {
    const params = ParamsService.getWorkQueuesParams();
    Meteor.call("workQueues.list", params, (err, workQueues) => {
      if (!err) {
        this.setState({ workQueues });
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

  setWorkQueue = _id => {
    const { currentWorkQueue } = this.state;

    if (currentWorkQueue === _id) {
      this.setState({ currentWorkQueue: null });
    } else {
      this.setState({ currentWorkQueue: _id, create: false });
    }
  };

  selectWorkQueue = _id => {
    const { workQueuesSelected } = this.state;
    if (workQueuesSelected.includes(_id)) {
      workQueuesSelected.splice(workQueuesSelected.indexOf(_id), 1);
    } else {
      workQueuesSelected.push(_id);
    }
    this.setState({ workQueuesSelected });
  };

  createForm = () => {
    this.setState({
      currentWorkQueue: false,
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
    const { workQueuesSelected } = this.state;
    Meteor.call("workQueues.deleteMany", workQueuesSelected, err => {
      if (!err) {
        Notifier.success("Work Queues deleted !");
        this.setState({
          workQueuesSelected: []
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

    this.listWorkQueues();
  };

  updatePager = () => {
    // update the pager count
    const queryParams = ParamsService.getWorkQueuesParams();
    this.recount(queryParams);
  };

  render() {
    const {
      workQueuesSelected,
      currentWorkQueue,
      create,
      range,
      total,
      workQueues
    } = this.state;

    if (!workQueues) {
      return <Loading />;
    }

    return (
      <div className="cc-container">
        <div
          className={
            currentWorkQueue || create ? "left__side" : "left__side full__width"
          }
        >
          <WorkQueueSearchBar
            setPagerInitial={this.setPagerInitial}
            btnGroup={workQueuesSelected.length}
            deleteAction={this.deleteAction}
            hideSort
            hideFilter
          />
          <WorkQueueList
            class={
              this.state.filter
                ? "task-list module-tags decreased"
                : "task-list module-tags"
            }
            workQueuesSelected={workQueuesSelected}
            selectWorkQueue={this.selectWorkQueue}
            currentWorkQueue={currentWorkQueue}
            setWorkQueue={this.setWorkQueue}
            workQueues={workQueues}
          />
          <PaginationBar
            create={this.createForm}
            nextPage={this.nextPage}
            module="Work Queue Modules"
            range={range}
            total={total}
          />
        </div>
        {(currentWorkQueue || create) && (
          <WorkQueuePanel
            currentWorkQueue={currentWorkQueue}
            create={create}
            close={this.closeForm}
          />
        )}
      </div>
    );
  }
}
