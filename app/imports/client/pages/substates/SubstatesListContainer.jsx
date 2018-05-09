import React, { Component } from 'react';
import PaginationBar from '/imports/client/lib/PaginationBar';
import SearchBar from '/imports/client/lib/SearchBar';
import SubstatesList from './components/SubstatesList';
import SubstateContent from './SubstateContent';
import SubstateCreate from './SubstateCreate';
import { withQuery } from 'meteor/cultofcoders:grapher-react';
import query from "/imports/api/substates/queries/listSubstates";
import Loading from '/imports/client/lib/ui/Loading';
import { objectFromArray } from "/imports/api/utils";
import Notifier from '/imports/client/lib/Notifier';
import PagerService from "/imports/client/lib/PagerService";

class SubstatesListContainer extends Component {
    constructor() {
        super();
        this.state = {
            substateSelected: [],
            currentSubstate: null,
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

    setSubstate = (_id) => {
        const { currentSubstate } = this.state;

        if (currentSubstate === _id) {
            this.setState({ currentSubstate: null });
        } else {
            this.setState({ currentSubstate: _id });
        }
    };

    selectSubstate = (_id) => {
        const { substateSelected } = this.state;
        if (substateSelected.includes(_id)) {
            substateSelected.splice(substateSelected.indexOf(_id), 1);
        } else {
            substateSelected.push(_id);
        }
        this.setState({ substateSelected });
    };

    createForm = () => {
        this.setState({
            create: true,
            rightSide: true,
            currentSubstate: false
        })
    }

    closeForm = () => {
        this.setState({
            create: false
        })
    }

    deleteAction = () => {
        const { substateSelected } = this.state;

        Meteor.call('substate.deleteMany', substateSelected, (err) => {
            if (!err) {
                Notifier.success('Substates deleted !');
                this.setState({
                    currentSubstate: null,
                    substateSelected: []
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
        const { substateSelected, currentSubstate, create, filter, range, total } = this.state;
        const substate = objectFromArray(data, currentSubstate);
        if (loading) {
            return <Loading />
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }

        return (
            <div className="cc-container substates-container">
                <div className={(currentSubstate || create) ? "left__side" : "left__side full__width"}>
                    <SearchBar btnGroup={substateSelected.length} deleteAction={this.deleteAction} />

                    <SubstatesList
                        class={filter ? "task-list decreased" : "task-list"}
                        substateSelected={substateSelected}
                        selectSubstate={this.selectSubstate}
                        currentSubstate={currentSubstate}
                        setSubstate={this.setSubstate}
                        substates={data}
                    />
                    {/* <div className="table-list">
                        <div className="table-list__wrapper">
                            <div className="table-container">
                                <div className="table-row">
                                    <div className="table-header text-center table-field text-light-grey"></div>
                                    <div className="table-header text-center table-field text-light-grey">
                                        State Name
                                    </div>
                                    <div className="table-header text-center table-field text-light-grey">
                                        Substate Name
                                    </div>
                                    <div className="table-header text-center table-field text-light-grey">
                                        Descriptions
                                    </div>
                                    <div className="table-header text-center table-field text-light-grey">
                                        Triggering Actions
                                    </div>
                                    <div className="table-header text-center table-field text-light-grey">
                                        Actions
                                    </div>
                                </div>
                                <div className="table-row">
                                    <div className="right-side">
                                        <div className="table-field text-center">
                                            <div className="check-item">
                                                <input checked type="checkbox" className="hidden" />
                                                <label></label>
                                            </div>
                                        </div>
                                        <div className="table-field text-center">
                                            S name
                                        </div>
                                        <div className="table-field text-center">
                                            sub s name
                                        </div>
                                        <div className="table-field text-center">
                                            desc
                                        </div>
                                        <div className="table-field text-center">
                                            trigger
                                        </div>
                                        <div className="table-field text-center">
                                            action
                                        </div>
                                    </div>
                                </div>
                                <div className="table-row">
                                    <div className="right-side">
                                        <div className="table-field text-center">
                                            <div className="check-item">
                                                <input type="checkbox" className="hidden" />
                                                <label></label>
                                            </div>
                                        </div>
                                        <div className="table-field text-center">
                                            S name
                                            </div>
                                        <div className="table-field text-center">
                                            sub s name
                                            </div>
                                        <div className="table-field text-center">
                                            desc
                                            </div>
                                        <div className="table-field text-center">
                                            trigger
                                            </div>
                                        <div className="table-field text-center">
                                            action
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <PaginationBar
                        module="Substate"
                        create={this.createForm}
                        nextPage={this.nextPage}
                        range={range}
                        total={total}
                    />
                </div>
                {
                    (currentSubstate || create) &&
                    <RightSide
                        substate={substate}
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
        const { substate, create, close } = this.props;
        return (
            <div className={fade ? "right__side in" : "right__side"}>
                {
                    create ? <SubstateCreate close={close} /> : <SubstateContent substate={substate} />
                }
            </div>
        )
    }
}

export default withQuery((props) => {
    const page = FlowRouter.getQueryParam("page");
    const perPage = 13;
    return PagerService.setQuery(query, { page, perPage });
}, { reactive: true })(SubstatesListContainer)
