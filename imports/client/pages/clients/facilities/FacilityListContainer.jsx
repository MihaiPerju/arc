import React from 'react';
import Pager from '/imports/client/lib/Pager.jsx';
import FacilityListQuery from '/imports/api/facilities/queries/facilityList.js';
import FacilityList from './components/FacilityList.jsx';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';

export default class FacilityListContainer extends Pager {
    constructor() {
        super();

        _.extend(this.state, {
            perPage: 10,
            filters: {}
        });

        this.query = FacilityListQuery.clone();
        this.FacilityListWrapper = createQueryContainer(this.query, FacilityList, {
            reactive: false
        })
    }

    render() {
        const params = _.extend({}, this.getPagerOptions());
        const FacilityListWrapper = this.FacilityListWrapper;
        const clientId = FlowRouter.current().params._id;

        return (
            <div>
                <h3>Facility List</h3>
                <button onClick={() => {
                    FlowRouter.go("facility.create", {_id: clientId})
                }}>
                    Create
                </button>
                {this.getPaginator()}
                <FacilityListWrapper params={params}/>
                {this.getPaginator()}
            </div>
        );
    }
}