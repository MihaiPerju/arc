import React, {Component} from 'react';
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import FilterBar from '/imports/client/lib/FilterBar.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import FacilityList from './components/FacilityList.jsx';
import FacilityContent from './FacilityContent.jsx';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import query from "/imports/api/facilities/queries/facilityList";
import Loading from '/imports/client/lib/ui/Loading';

class FacilityContainer extends Component {
    constructor() {
        super();
        this.state = {
            currentFacility: null,
            filter: false,
            facilitiesSelected: []
        };
    }


    setFacility = (_id) => {
        const {currentFacility} = this.state;

        if (currentFacility === _id) {
            this.setState({currentFacility: null});
        } else {
            this.setState({currentFacility: _id});
        }
    }

    selectFacility = (_id) => {
        const {facilitiesSelected} = this.state;
        if (facilitiesSelected.includes(_id)) {
            facilitiesSelected.splice(facilitiesSelected.indexOf(_id), 1);
        } else {
            facilitiesSelected.push(_id);
        }
        this.setState({facilitiesSelected});
    }

    getFacility() {
        const {data} = this.props;
        const {currentFacility} = this.state;
        for (facility of data) {
            if (facility._id === currentFacility) {
                return facility;
            }
        }
    }


    render() {
        const {data, loading, error} = this.props;
        const {facilitiesSelected, currentFacility} = this.state;
        const facility = this.getFacility();

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }

        return (
            <div className="cc-container">
                <div className={currentFacility ? "left__side" : "left__side full__width"}>
                    <SearchBar btnGroup={facilitiesSelected.length}/>
                    <FacilityList
                        class={this.state.filter ? "task-list decreased" : "task-list"}
                        facilitiesSelected={facilitiesSelected}
                        setFacility={this.setFacility.bind(this)}
                        selectFacility={this.selectFacility}
                        currentFacility={currentFacility}
                        facilities={data}
                    />
                    <PaginationBar/>
                </div>
                {
                    currentFacility && <RightSide facility={facility}/>
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
        const {facility} = this.props;

        return (
            <div className={fade ? "right__side in" : "right__side"}>
                <FacilityContent facility={facility}/>
            </div>
        )
    }
}

export default withQuery(() => {
    return query.clone();
})(FacilityContainer)