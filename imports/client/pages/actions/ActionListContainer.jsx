import React, {Component} from 'react';
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import FilterBar from '/imports/client/lib/FilterBar.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import ActionList from './components/ActionList.jsx';
import ActionContent from './ActionContent.jsx';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import query from "/imports/api/actions/queries/actionList";
import Loading from '/imports/client/lib/ui/Loading';
import {objectFromArray} from "/imports/api/utils";

class ActionListContainer extends Component {
    constructor() {
        super();
        this.state = {
            actionsSelected: [],
            currentAction: null,
            filter: false
        }
    }

    setAction = (_id) => {
        const {currentAction} = this.state;
/*
import { createQueryContainer } from 'meteor/cultofcoders:grapher-react';
import SearchInput from '/imports/client/lib/SearchInput.jsx';
import { Container } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { Divider } from 'semantic-ui-react';
import { Header } from 'semantic-ui-react';
import ReasonCodesDialog from './components/ReasonCodesDialog';

export default class ActionListContainer extends Pager {
    constructor () {
        super();

        _.extend(this.state, {
            perPage: 3,
            filters: {},
            actionReasonCodes: false
        });

        this.query = query.clone();
        this.ActionListCont = createQueryContainer(this.query, ActionList, {
            reactive: false
        });
    }

    handleSearch = (searchValue) => {
        this.updateFilters({
            filters: {
                title: {
                    '$regex': searchValue,
                    '$options': 'i'
                }
            }
        });
    };
*/

        if (currentAction === _id) {
            this.setState({currentAction: null});
        } else {
            this.setState({currentAction: _id});
        }
    };

    selectAction = (_id) => {
        const {actionsSelected} = this.state;
        if (actionsSelected.includes(_id)) {
            actionsSelected.splice(actionsSelected.indexOf(_id), 1);
        } else {
            actionsSelected.push(_id);
        }
        this.setState({actionsSelected});
    };

    handleClose = () => {
        this.setState({
            actionReasonCodes: false
        });
    };

    handleCurrentAction = (actionReasonCodes) => {
        this.setState({
            actionReasonCodes
        });
    }

    render() {
        const {data, loading, error} = this.props;
        const {actionsSelected, currentAction} = this.state;
        const action = objectFromArray(data, currentAction);
        /*
        const params = _.extend({}, this.getPagerOptions());
        const ActionListCont = this.ActionListCont;
        const {sortBy, isSortAscend, actionReasonCodes} = this.state;
         */
        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }
        return (
            <div className="cc-container">
                <div className={currentAction ? "left__side" : "left__side full__width"}>
                    <SearchBar btnGroup={actionsSelected.length}/>
                    <ActionList
                        class={this.state.filter ? "task-list decreased" : "task-list"}
                        actionsSelected={actionsSelected}
                        selectAction={this.selectAction}
                        currentAction={currentAction}
                        setAction={this.setAction}
                        actions={data}
                    />
                    <PaginationBar/>
                </div>
                {
                    currentAction ? (
                        <RightSide action={action}/>
                    ) : null
                }
            </div>
/*
            <Container className="page-container">
                <div>
                    <Header as="h2" textAlign="center">Actions</Header>
                    <SearchInput handleSearch={this.handleSearch}/>
                </div>
                <div className='m-t-30'>
                    {this.getPaginator()}
                    <ActionListCont params={params}
                                    handleHeaderClick={this.handleHeaderClick}
                                    reasonCodesManage={this.handleCurrentAction}/>
                    {this.getPaginator()}
                </div>
                {actionReasonCodes && <ReasonCodesDialog actionId={actionReasonCodes}
                                                              closeAction={this.handleClose}/>}
            </Container>
*/
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
            this.setState({fade: true});
        }, 300);
    }

    render() {
        const {action} = this.props;
        return (
            <div className={this.state.fade ? "right__side in" : "right__side"}>
                <ActionContent action={action}/>
            </div>
        )
    }
}


export default withQuery((props) => {
    return query.clone();
})(ActionListContainer)
