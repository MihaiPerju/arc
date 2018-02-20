import React, {Component} from 'react';
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import FilterBar from '/imports/client/lib/FilterBar.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import ClientList from './components/ClientList.jsx';
import ClientContent from './ClientContent.jsx';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import query from "../../../api/clients/queries/listClients";
import Loading from '/imports/client/lib/ui/Loading';

class ClientContainer extends Component {
    constructor() {
        super();
        this.state = {
            rightSide: false,
            btnGroup: false,
            filter: false
        }
        this.renderRightSide = this.renderRightSide.bind(this);
        this.showBtnGroup = this.showBtnGroup.bind(this);
        this.showFilterBar = this.showFilterBar.bind(this);
    }

    renderRightSide() {
        this.setState({
            rightSide: true
        })
    }

    showBtnGroup() {
        this.setState({
            btnGroup: !this.state.btnGroup
        })
    }

    showFilterBar() {
        this.setState({
            filter: !this.state.filter
        })
    }

    render() {
        const {data, loading, error} = this.props;
        console.log(data);

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }
        return (
            <div className="cc-container">
                <div className={this.state.rightSide ? "left__side" : "left__side full__width"}>
                    <SearchBar btnGroup={this.state.btnGroup} filter={this.showFilterBar}/>
                    {this.state.filter ? <FilterBar/> : null}
                    <ClientList
                        clients={data}
                        class={this.state.filter ? "task-list decreased" : "task-list"}
                        renderContent={this.renderRightSide}
                        showBtnGroup={this.showBtnGroup}
                    />
                    <PaginationBar/>
                </div>
                {
                    this.state.rightSide ? (
                        <RightSide/>
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
        return (
            <div className={this.state.fade ? "right__side in" : "right__side"}>
                <ClientContent/>
            </div>
        )
    }
}

export default withQuery((props) => {
    return query.clone();
})(ClientContainer)