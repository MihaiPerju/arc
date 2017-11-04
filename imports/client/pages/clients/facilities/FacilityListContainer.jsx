import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import FacilityListQuery from '/imports/api/facilities/queries/facilityList.js';
import FacilityList from './components/FacilityList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import SearchInput from "/imports/client/lib/SearchInput.jsx";
import SelectDropDown from "/imports/client/lib/SelectDropDown.jsx";
import FacilityStatusEnum from "/imports/api/facilities/enums/statuses.js";
import FacilityRegionEnum from "/imports/api/facilities/enums/regions.js";
import {Container} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'
import {Header} from 'semantic-ui-react'
import {Divider} from 'semantic-ui-react'

export default class FacilityListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 10,
            filters: {},
            sortBy: 'none',
            isSortAscend: true,
            status: '',
            region: ''
        });

        this.query = FacilityListQuery.clone();
        this.FacilityListWrapper = createQueryContainer(this.query, FacilityList, {
            reactive: false
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
        const {status, region} = this.state;
        let selectFilters = [{[selectionType]: selectedValue}];

        if (selectionType === 'status' && region !== '') {
            selectFilters.push({region})
        } else if (selectionType === 'region' && status !== '') {
            selectFilters.push({status})
        }

        this.setState({[selectionType]: selectedValue},
            this.updateFilters({
                filters: {
                    $and: selectFilters
                }
            })
        );
    };

    render() {
        const params = _.extend({}, this.getPagerOptions());
        const FacilityListWrapper = this.FacilityListWrapper;
        const clientId = FlowRouter.current().params._id;
        const {sortBy, isSortAscend} = this.state;

        return (
            <Container>
                <Header as="h3" textAlign="center">Facility List</Header>


                <div>
                    <SelectDropDown name="Status"
                                    selectionType="status"
                                    enums={FacilityStatusEnum}
                                    handleSelectBy={this.handleSelectBy}/>
                    <SelectDropDown name="Region"
                                    selectionType="region"
                                    enums={FacilityRegionEnum}
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