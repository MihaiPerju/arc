import React, {Component} from 'react';
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import ClientList from './components/ClientList.jsx';
import ClientContent from './ClientContent.jsx';
import ClientCreate from './ClientCreate.jsx';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import query from '../../../api/clients/queries/listClients';
import Loading from '/imports/client/lib/ui/Loading';
import Notifier from '/imports/client/lib/Notifier';
import Pager from "../../lib/Pager";
import PagerService from "../../lib/PagerService";

class ClientContainer extends Pager {
    constructor() {
        super();
        _.extend(this.state, {
            currentClient: null,
            clientsSelected: [],
            create: false,
            page: 1,
            perPage: 13,
            total: 0,
            range: {}
        });
        this.query = query;
    }

    componentWillMount() {
        this.nextPage(0);
    }

    setClient = (_id) => {
        const {currentClient} = this.state;

        if (currentClient === _id) {
            this.setState({currentClient: null});
        } else {
            this.setState({currentClient: _id, create: false});
        }
    };

    selectClient = (_id) => {
        const {clientsSelected} = this.state;
        if (clientsSelected.includes(_id)) {
            clientsSelected.splice(clientsSelected.indexOf(_id), 1);
        } else {
            clientsSelected.push(_id);
        }
        this.setState({
            clientsSelected
        });
    };


    getClient = () => {
        const {data} = this.props;
        const {currentClient} = this.state;
        for (client of data) {
            if (client._id === currentClient) {
                return client;
            }
        }
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
    };

    deleteAction = () => {
        const {clientsSelected} = this.state;

        Meteor.call('client.deleteMany', clientsSelected, (err) => {
            if (!err) {
                Notifier.success('Clients deleted !');
            }
        });
    };

    nextPage = (inc) => {
        const {perPage, total, page} = this.state;
        const nextPage = PagerService.setPage({page, perPage, total}, inc);
        const range = PagerService.getRange(nextPage, perPage);
        FlowRouter.setQueryParams({page: nextPage});
        this.setState({range, page: nextPage, currentClient: null});
    };

    render() {
        const {data, loading, error} = this.props;
        const {clientsSelected, currentClient, create, range, total} = this.state;
        const client = this.getClient();

        if (loading) {
            return <Loading/>;
        }

        if (error) {
            return <div>Error: {error.reason}</div>;
        }
        return (
            <div className="cc-container">
                <div className={
                    currentClient ? 'left__side' : create ? 'left__side' : 'left__side full__width'
                }>
                    <SearchBar btnGroup={clientsSelected.length} deleteAction={this.deleteAction}/>
                    <ClientList
                        class={this.state.filter ? 'task-list decreased' : 'task-list'}
                        setClient={this.setClient.bind(this)}
                        selectClient={this.selectClient}
                        currentClient={currentClient}
                        clients={data}
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
                {
                    (currentClient || create) &&
                    <RightSide
                        client={client}
                        create={create}
                        close={this.closeForm}
                    />
                }
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
            this.setState({fade: true});
        }, 300);
    }

    render() {
        const {client, create, close} = this.props;
        const {fade} = this.state;

        return (
            <div className={fade ? 'right__side in' : 'right__side'}>
                {
                    create ? <ClientCreate close={close}/> : <ClientContent client={client}/>
                }
            </div>
        );
    }
}

export default withQuery((props) => {
    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;
    return PagerService.setQuery(query, {page, perPage});
}, {reactive: true})(ClientContainer);
