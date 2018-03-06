import React, {Component} from 'react';
import PaginationBar from '/imports/client/lib/PaginationBar.jsx';
import SearchBar from '/imports/client/lib/SearchBar.jsx';
import FacilityList from './components/FacilityList.jsx';
import FacilityContent from './FacilityContent.jsx';
import FacilityCreate from './FacilityCreate.jsx';
import {withQuery} from 'meteor/cultofcoders:grapher-react';
import query from "/imports/api/facilities/queries/facilityList";
import Loading from '/imports/client/lib/ui/Loading';

class FacilityContainer extends Component {
    constructor() {
        super();
        this.state = {
            currentFacility: null,
            filter: false,
            facilitiesSelected: [],
            create: false
        };
    }


    setFacility = (_id) => {
        this.closeForm();
        const {currentFacility} = this.state;

        if (currentFacility === _id) {
            this.setState({currentFacility: null});
        } else {
            this.setState({currentFacility: _id, create: false});
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

    createForm = () => {
        this.setState({
            currentFacility: false,
            create: true
        })
    }

    closeForm = () => {
        this.setState({
            create: false
        })
    }

    render() {
        const {data, loading, error} = this.props;
        const {facilitiesSelected, currentFacility, create} = this.state;
        const facility = this.getFacility();

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return <div>Error: {error.reason}</div>
        }

        return (
            <div className="cc-container">
                <div className={(currentFacility || create) ? "left__side" : "left__side full__width"}>
                    <SearchBar btnGroup={facilitiesSelected.length}/>
                    <FacilityList
                        class={this.state.filter ? "task-list decreased" : "task-list"}
                        facilitiesSelected={facilitiesSelected}
                        setFacility={this.setFacility.bind(this)}
                        selectFacility={this.selectFacility}
                        currentFacility={currentFacility}
                        facilities={data}
                    />
                    <PaginationBar
                        module="Facility"
                        create={this.createForm}
                        closeForm={this.closeForm}
                    />
                </div>
                {
                    (currentFacility || create) &&
                    <RightSide
                        facility={facility}
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
        const {facility, create, close} = this.props;

        return (
            <div className={fade ? "right__side in" : "right__side"}>
                {
                    create ? <FacilityCreate close={close}/> : <FacilityContent facility={facility}/>
                }
            </div>
        )
    }
}

export default withQuery(() => {
    return query.clone({
        filters: {
            clientId: FlowRouter.current().params._id
        }});
})(FacilityContainer)