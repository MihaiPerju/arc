import React, { Component } from 'react';
import PaginationBar from '/imports/client/lib/PaginationBar';
import SearchBar from '/imports/client/lib/SearchBar';
import SubStatesList from './components/SubStatesList';
import SubStateContent from './SubStateContent';
import SubStateCreate from './SubStateCreate';
import { withQuery } from 'meteor/cultofcoders:grapher-react';
import query from "/imports/api/subStates/queries/listSubStates";
import Loading from '/imports/client/lib/ui/Loading';
import { objectFromArray } from "/imports/api/utils";
import Notifier from '/imports/client/lib/Notifier';
import PagerService from "/imports/client/lib/PagerService";

class SubStatesListContainer extends Component {
    constructor() {
        super();
        this.state = {
            subStateSelected: [],
            currentSubState: null,
            filter: false,
            create: false,
            page: 1,
            perPage: 13,
            total: 0,
            range: {}
        }
    }

    componentWillMount() {
        this.nextPage(0);
    }

    setSubState = (_id) => {
        const { currentSubState } = this.state;

        if (currentSubState === _id) {
            this.setState({ currentSubState: null });
        } else {
            this.setState({ currentSubState: _id });
        }
    };

    selectSubState = (_id) => {
        const { subStateSelected } = this.state;
        if (subStateSelected.includes(_id)) {
            subStateSelected.splice(subStateSelected.indexOf(_id), 1);
        } else {
            subStateSelected.push(_id);
        }
        this.setState({ subStateSelected });
    };

    createForm = () => {
        this.setState({
            create: true,
            rightSide: true,
            currentSubState: false
        })
    }

    closeForm = () => {
        this.setState({
            create: false
        })
    }

    deleteAction = () => {
        const { subStateSelected } = this.state;

        Meteor.call('subState.deleteMany', subStateSelected, (err) => {
            if (!err) {
                Notifier.success('Sub states deleted !');
                this.setState({
                    currentSubState: null,
                    subStateSelected: []
                })
            }
        });
    };

    nextPage = (inc) => {
        const { perPage, total, page } = this.state;
        const nextPage = PagerService.setPage({ page, perPage, total }, inc);
        const range = PagerService.getRange(nextPage, perPage);
        FlowRouter.setQueryParams({ page: nextPage });
        this.setState({ range, page: nextPage, currentClient: null });
    }

    render() {
        const { data, loading, error } = this.props;
        const { subStateSelected, currentSubState, create, filter, range, total } = this.state;
        const subState = objectFromArray(data, currentSubState);
        if (loading) {
            return <Loading />
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }
        return (
            <div className="cc-container">
                <div className={(currentSubState || create) ? "left__side" : "left__side full__width"}>
                    <SearchBar btnGroup={subStateSelected.length} deleteAction={this.deleteAction} />

                    <SubStatesList
                        class={filter ? "task-list decreased" : "task-list"}
                        subStateSelected={subStateSelected}
                        selectSubState={this.selectSubState}
                        currentSubState={currentSubState}
                        setSubState={this.setSubState}
                        subStates={data}
                    />
                    <PaginationBar
                        module="SubState"
                        create={this.createForm}
                        nextPage={this.nextPage}
                        range={range}
                        total={total}
                    />
                </div>
                {
                    (currentSubState || create) &&
                    <RightSide
                        subState={subState}
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
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ fade: true });
        }, 300);
    }

    render() {
        const { fade } = this.state;
        const { subState, create, close } = this.props;
        return (
            <div className={fade ? "right__side in" : "right__side"}>
                {
                    create ? <SubStateCreate close={close} /> : <SubStateContent subState={subState} />
                }
            </div>
        )
    }
}

export default withQuery((props) => {
    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;
    return PagerService.setQuery(query, { page, perPage });
}, { reactive: true })(SubStatesListContainer)
