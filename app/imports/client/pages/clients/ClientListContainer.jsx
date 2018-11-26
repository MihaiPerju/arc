import React from "react";
import PaginationBar from "/imports/client/lib/PaginationBar.jsx";
import ClientSearchBar from "./components/ClientSearchBar.jsx";
import ClientList from "./components/ClientList.jsx";
import Notifier from "/imports/client/lib/Notifier";
import Pager from "../../lib/Pager";
import ParamsService from "../../lib/ParamsService";
import TagsListQuery from "/imports/api/tags/queries/listTags";
import { moduleNames } from "/imports/api/tags/enums/tags";
import RightSide from "./components/ClientRightSide";

export default class ClientContainer extends Pager {
  constructor() {
    super();
    _.extend(this.state, {
      currentClient: null,
      clientsSelected: [],
      create: false,
      page: 1,
      perPage: 13,
      total: 0,
      range: {},
      filter: false,
      tags: [],
      clients: []
    });
    this.method = "clients.count";
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.nextPage(0);
    this.getTags();

    this.pollingMethod = setInterval(() => {
      this.listClients();
    }, 3000);
  }

  componentWillUnmount() {
    //Removing Interval
    clearInterval(this.pollingMethod);
  }

  listClients = () => {
    const params = ParamsService.getClientParams();
    Meteor.call("clients.get", params, (err, clients) => {
      if (!err) {
        this.setState({ clients });
        this.updatePager();
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  componentWillReceiveProps() {
    const { queryParams } = FlowRouter.current();
    if (queryParams.clientName && queryParams.clientName == "") {
      this.setPagerInitial();
    }
    this.updatePager();
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

  setClient = _id => {
    const { currentClient } = this.state;

    if (currentClient === _id) {
      this.setState({ currentClient: null });
    } else {
      this.setState({ currentClient: _id, create: false });
    }
  };

  selectClient = _id => {
    const { clientsSelected } = this.state;
    if (clientsSelected.includes(_id)) {
      clientsSelected.splice(clientsSelected.indexOf(_id), 1);
    } else {
      clientsSelected.push(_id);
    }
    this.setState({
      clientsSelected
    });
  };

  createForm = () => {
    this.setState({
      currentClient: false,
      create: true
    });
  };

  closeForm = () => {
    this.setState({
      create: false
    });
    this.updatePager();
  };
  getClient = () => {
    const { currentClient, clients } = this.state;
    for (let client of clients) {
      if (client._id === currentClient) {
        return client;
      }
    }
  };

  deleteAction = () => {
    const { clientsSelected } = this.state;

    Meteor.call("client.deleteMany", clientsSelected, err => {
      if (!err) {
        Notifier.success("Clients deleted !");
        this.setState({
          clientsSelected: []
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
    // Update the pager count
    const params = ParamsService.getClientParams();
    this.recount(params);
  };

  getTags = () => {
    TagsListQuery.clone({
      filters: { entities: { $in: [moduleNames.CLIENTS] } }
    }).fetch((err, tags) => {
      if (!err) {
        this.setState({ tags });
      }
    });
  };

  render() {
    const {
      clientsSelected,
      currentClient,
      create,
      clients,
      range,
      total,
      tags
    } = this.state;
    return (
      <div className="cc-container">
        <div
          className={
            currentClient
              ? "left__side"
              : create
              ? "left__side"
              : "left__side full__width"
          }
        >
          <ClientSearchBar
            setPagerInitial={this.setPagerInitial}
            btnGroup={clientsSelected.length}
            deleteAction={this.deleteAction}
            tags={tags}
            hideSort
          />
          <ClientList
            class={
              this.state.filter
                ? "task-list clients decreased"
                : "task-list clients"
            }
            setClient={this.setClient.bind(this)}
            selectClient={this.selectClient}
            currentClient={currentClient}
            clients={clients}
            tags={tags}
          />
          <PaginationBar
            module="Client"
            create={this.createForm}
            closeForm={this.closeForm}
            nextPage={this.nextPage}
            range={range}
            total={total}
          />
        </div>
        {(currentClient || create) && (
          <RightSide
            currentClient={currentClient}
            create={create}
            close={this.closeForm}
            setClient={this.setClient}
          />
        )}
      </div>
    );
  }
}
