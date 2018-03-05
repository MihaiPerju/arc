import React, {Component} from 'react'
import CodeList from './components/CodeList.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import CodeContent from './CodeContent.jsx';
import CodeCreate from './CodeCreate.jsx';
import FilterBar from '/imports/client/lib/FilterBar.jsx';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import query from "/imports/api/codes/queries/listCodes";
import Loading from '/imports/client/lib/ui/Loading';
import {objectFromArray} from "/imports/api/utils";

class CodeListContainer extends Component {
    constructor() {
        super();
        this.state = {
            codesSelected: [],
            currentCode: null,
            filter: false,
            create: false
        };
        this.showFilterBar = this.showFilterBar.bind(this);
    }

    showFilterBar() {
        this.setState({
            filter: !this.state.filter
        })
    }

    setCode = (_id) => {
        const {currentCode} = this.state;

        if (currentCode === _id) {
            this.setState({currentCode: null});
        } else {
            this.setState({currentCode: _id, create: false});
        }
    };

    selectCode = (_id) => {
        const {codesSelected} = this.state;
        if (codesSelected.includes(_id)) {
            codesSelected.splice(codesSelected.indexOf(_id), 1);
        } else {
            codesSelected.push(_id);
        }
        this.setState({codesSelected});
    };

    createForm = () => {
        this.setState({
            currentCode: false,
            create: true
        })
    };

    closeForm = () => {
        this.setState({
            create: false
        })
    };

    render() {
        const {data, loading, error} = this.props;
        const {codesSelected, currentCode, create} = this.state;
        const code = objectFromArray(data, currentCode);

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }
        return (
            <div className="cc-container">
                <div className={(currentCode || create) ? "left__side" : "left__side full__width"}>
                    <SearchBar btnGroup={codesSelected.length} filter={this.showFilterBar}/>
                    <CodeList
                        class={this.state.filter ? "task-list decreased" : "task-list"}
                        codesSelected={codesSelected}
                        selectCode={this.selectCode}
                        currentCode={currentCode}
                        setCode={this.setCode}
                        codes={data}
                    />
                    <PaginationBar module="Code" create={this.createForm}/>
                </div>
                {
                    (currentCode || create) &&
                    <RightSide
                        code={code}
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
        const {fade} = this.state;
        const {code, create, close} = this.props;
        return (
            <div className={fade ? "right__side in" : "right__side"}>
                {
                    create ? <CodeCreate close={close}/> : <CodeContent code={code}/>
                }
            </div>
        )
    }
}

export default withQuery((props) => {
    return query.clone();
}, {reactive: true})(CodeListContainer)