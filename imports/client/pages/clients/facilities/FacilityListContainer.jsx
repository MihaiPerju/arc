import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import FacilityListQuery from '/imports/api/facilities/queries/facilityList.js';
import FacilityList from './components/FacilityList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import SearchInput from "/imports/client/lib/SearchInput.jsx";
import SelectDropDown from "/imports/client/lib/SelectDropDown.jsx";
import FacilityStatusEnum from "/imports/api/facilities/enums/statuses.js";
import {Container, Button, Header, Divider} from 'semantic-ui-react';
import Notifier from '/imports/client/lib/Notifier';

export default class FacilityListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 10,
            filters: {},
            sortBy: 'none',
            isSortAscend: true,
            status: '',
            regionIds: null,
            regions: [],

        });

        this.query = FacilityListQuery.clone();
        this.FacilityListWrapper = createQueryContainer(this.query, FacilityList, {
            reactive: false
        })
    }

    componentDidMount() {
        Meteor.call('regions.get', (err, regions) => {
            if (!err) {
                this.setState({regions});
            } else {
                Notifier.error("Couldn't get regions");
            }
        })
    }

    handleSearch = (searchValue) => {
        this.updateFilters({
            filters: {
                name: {
                    '$regex': searchValue,
                    '$options': 'i'
                }
            }
        })
    };

    handleHeaderClick = (headerName) => {
        const {sortBy, isSortAscend} = this.state;

        if (sortBy === headerName) {
            this.setState({
                isSortAscend: !isSortAscend
            }, this.handleSort);
        } else {
            this.setState({
                sortBy: headerName,
                isSortAscend: true
            }, this.handleSort);
        }
    };

    handleSort = () => {
        const {sortBy, isSortAscend} = this.state;

        this.updateFilters({
            options: {
                sort: {
                    [sortBy]: isSortAscend ? 1 : -1
                }
            }
        });
    };

    handleSelectBy = (selectionType, selectedValue) => {
        const {status, regionIds} = this.state;
        let selectFilters = [];

        if (selectionType === 'regionIds') {
            selectFilters = [{regionIds: {$in: [selectedValue]}}];
            this.setState({regionIds: {$in: [selectedValue]}});
            if (status) {
                selectFilters.push({status});
            }
        } else {
            selectFilters = [{[selectionType]: selectedValue}];
            this.setState({[selectionType]: selectedValue});
            if (regionIds) {
                selectFilters.push({regionIds})
            }
        }

        this.updateFilters({
            filters: {
                $and: selectFilters
            }
        });
    };

    getRegionsOptions(regions) {
        let regionOptions = [];
        regions.map((region) => {
            regionOptions.push({label: region.name, value: region._id})
        });
        return regionOptions;
    }

    render() {
        const params = _.extend({}, this.getPagerOptions());
        const FacilityListWrapper = this.FacilityListWrapper;
        const clientId = FlowRouter.current().params._id;
        const {regions, sortBy, isSortAscend} = this.state;
        const regionOptions = this.getRegionsOptions(regions);

        return (
            <Container className="page-container">
                <Header as="h3" textAlign="center">Facility List</Header>


                <div>
                    <SelectDropDown name="Status"
                                    selectionType="status"
                                    enums={FacilityStatusEnum}
                                    handleSelectBy={this.handleSelectBy}/>
                    <SelectDropDown name="Region"
                                    selectionType="regionIds"
                                    regionOptions={regionOptions}
                                    handleSelectBy={this.handleSelectBy}/>
                </div>
                <SearchInput handleSearch={this.handleSearch}/>

                {this.getPaginator()}
                <FacilityListWrapper params={params}
                                     sortBy={sortBy}
                                     isSortAscend={isSortAscend}
                                     handleHeaderClick={this.handleHeaderClick}/>
                {this.getPaginator()}

                <Divider/>

                <Button primary fluid onClick={() => {
                    FlowRouter.go("facility.create", {_id: clientId})
                }}>
                    Create
                </Button>

            </Container>
        );
    }
}