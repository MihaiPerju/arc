import React, {Component} from 'react';
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import FilterBar from '/imports/client/lib/FilterBar.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import ActionList from './components/ActionList.jsx';
import ActionContent from './ActionContent.jsx';
import ActionCreate from './ActionCreate.jsx';
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
            filter: false,
            create: false
        }
    }

    setAction = (_id) => {
        const {currentAction} = this.state;

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

    createForm = () => {
        this.setState({
            currentAction: false,
            create: true,
            rightSide: true
        })
    }

    closeForm = () => {
        this.setState({
            create: false
        })

    }

    render() {
        const {data, loading, error} = this.props;
        const {actionsSelected, currentAction, create} = this.state;
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
                <div className={(currentAction || create) ? "left__side" : "left__side full__width"}>
                    <SearchBar btnGroup={actionsSelected.length}/>
                    <ActionList
                        class={this.state.filter ? "task-list decreased" : "task-list"}
                        actionsSelected={actionsSelected}
                        selectAction={this.selectAction}
                        currentAction={currentAction}
                        setAction={this.setAction}
                        actions={data}
                    />
                    <PaginationBar create={this.createForm}/>
                </div>
                {
                    (currentAction || create) &&
                    <RightSide
                        action={action}
                        create={create}
                        close={this.closeForm}
                    />
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
        const {fade} = this.state;
        const {action, create, close} = this.props;
        return (
            <div className={fade ? "right__side in" : "right__side"}>
                {
                    create ? <ActionCreate close={close}/> : <ActionContent action={action}/>
                }
            </div>
        )
    }
}


export default withQuery((props) => {
    return query.clone();
})(ActionListContainer)
