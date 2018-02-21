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

class ActionContainer extends Component {
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

    render() {
        const {data, loading, error} = this.props;
        const {actionsSelected, currentAction} = this.state;
        const action = objectFromArray(data, currentAction);

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
