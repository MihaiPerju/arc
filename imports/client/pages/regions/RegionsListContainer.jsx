import React, {Component} from 'react'
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import RegionsList from './components/RegionsList.jsx';
import RegionContent from './RegionContent.jsx';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import query from "/imports/api/regions/queries/regionList";
import Loading from '/imports/client/lib/ui/Loading';
import {objectFromArray} from "/imports/api/utils";

class RegionListContainer extends Component {
    constructor() {
        super();
        this.state = {
            regionsSelected: [],
            currentRegion: null,
            filter: false
        }
    }

    setRegion = (_id) => {
        const {currentRegion} = this.state;

        if (currentRegion === _id) {
            this.setState({currentRegion: null});
        } else {
            this.setState({currentRegion: _id});
        }
    };

    selectRegion = (_id) => {
        const {regionsSelected} = this.state;
        if (regionsSelected.includes(_id)) {
            regionsSelected.splice(regionsSelected.indexOf(_id), 1);
        } else {
            regionsSelected.push(_id);
        }
        this.setState({regionsSelected});
    };

    createRegion(){
        FlowRouter.go('region.create', {id: FlowRouter.current().params.id});
    }

    render() {
        const {data, loading, error} = this.props;
        const {regionsSelected, currentRegion} = this.state;
        const region = objectFromArray(data, currentRegion);

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }
        return (
            <div className="cc-container">
                <div className={currentRegion ? "left__side" : "left__side full__width"}>
                    <SearchBar btnGroup={regionsSelected.length}/>
                    <RegionsList
                        class={this.state.filter ? "task-list decreased" : "task-list"}
                        regionsSelected={regionsSelected}
                        selectRegion={this.selectRegion}
                        currentRegion={currentRegion}
                        setRegion={this.setRegion}
                        regions={data}
                    />
                    <PaginationBar noAddButton={false} onAdd={this.createRegion}/>
                </div>
                {
                    currentRegion ? (
                        <RightSide region={region}/>
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
        const {region} = this.props;
        return (
            <div className={this.state.fade ? "right__side in" : "right__side"}>
                <RegionContent region={region}/>
            </div>
        )
    }
}

export default withQuery((props) => {
    return query.clone({
        filters: {
            clientId: FlowRouter.current().params.id
        }
    });
})(RegionListContainer)
