import React, {Component} from 'react';
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import FilterBar from '/imports/client/lib/FilterBar.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import UserList from './components/UserList.jsx';
import UserContent from './UserContent.jsx';
import CreateUser from './CreateUser.jsx';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import query from "/imports/api/users/queries/listUsers";
import Loading from '/imports/client/lib/ui/Loading';
import {objectFromArray} from "/imports/api/utils";

class UserListContainer extends Component {
    constructor() {
        super();
        this.state = {
            rightSide: false,
            btnGroup: false,
            filter: false,
            usersSelected: [],
            currentUser: null,
            create: false
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

    selectUser(objectId) {
        const {usersSelected} = this.state;
        if (usersSelected.includes(objectId)) {
            usersSelected.splice(usersSelected.indexOf(objectId), 1);
        } else {
            usersSelected.push(objectId);
        }
        this.setState({usersSelected});
    }

    setUser(id) {
        const {currentUser} = this.state;
        if (currentUser === id) {
            this.setState({currentUser: null})
        } else {
            this.setState({currentUser: id})
        }
    }

    createForm = () => {
        this.setState({
            currentUser: false,
            create: true,
            rightSide: true
        });
    }

    closeForm = () => {
        this.setState({
            create: false
        })
    }

    render() {
        const {data, loading, error} = this.props;
        const {usersSelected, currentUser, create} = this.state;
        const user = objectFromArray(data, currentUser);

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <div>{error.reason}</div>
        }

        return (
            <div className="cc-container">
                <div className={(currentUser || create) ? "left__side" : "left__side full__width"}>
                    <SearchBar btnGroup={this.state.btnGroup} filter={this.showFilterBar}/>
                    {this.state.filter ? <FilterBar/> : null}
                    <UserList
                        class={this.state.filter ? "task-list decreased" : "task-list"}
                        renderContent={this.renderRightSide}
                        selectUser={this.selectUser.bind(this)}
                        setUser={this.setUser.bind(this)}
                        showBtnGroup={this.showBtnGroup}
                        usersSelected={usersSelected}
                        currentUser={currentUser}
                        users={data}
                    />
                    <PaginationBar
                        create={this.createForm}
                        closeForm={this.closeForm}
                    />
                </div>
                {
                    (currentUser || create) &&
                    <RightSide
                        user={user}
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
            this.setState({fade: true});
        }, 300);
    }

    render() {
        const {user, create, close} = this.props;
        const {fade} = this.state;
        return (
            <div className={fade ? "right__side in" : "right__side"}>
                {
                    create ? <CreateUser close={close}/> : <UserContent user={user}/>
                }
            </div>
        )
    }
}


export default withQuery((props) => {
    return query.clone();
})(UserListContainer)