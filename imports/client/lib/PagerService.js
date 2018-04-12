import stateEnum from '/imports/api/tasks/enums/states';

export default class PagerService {
    static setQuery(query, {page, perPage, state, assign, filters}) {
        let params = this.getPagerOptions(page, perPage);

        if (state) {
            this.getAccountFilters(params, state, filters);
            this.getProperAccounts(params, assign);
        }
        return query.clone(params);
    }

    static getAccountQueryParams() {
        const page = FlowRouter.getQueryParam("page");
        const assign = FlowRouter.getQueryParam("assign");
        const {state} = FlowRouter.current().params;
        const facilityId = FlowRouter.getQueryParam("facilityId");
        const clientId = FlowRouter.getQueryParam("clientId");
        const acctNum = FlowRouter.getQueryParam("acctNum");
        const perPage = 13;

        return {filters: {facilityId, clientId, acctNum}, page, perPage, state, assign,};
    }

    static getProperAccounts(params, assign) {
        if (assign === 'workQueue') {
            _.extend(params.filters, {workQueue: {$exists: true}});
        }
        else if (assign === 'assigneeId') {
            _.extend(params.filters, {assigneeId: {$exists: true}});
        }
    }

    static getAccountFilters(params, state, {acctNum, facilityId, clientId}) {
        if (state === "unassigned") {
            _.extend(params, {filters: {assigneeId: null, workQueue: null, tickleDate: null, escalateReason: null}});
        } else if (state === "tickles") {
            _.extend(params, {filters: {tickleDate: {$exists: true}, escalateReason: null}});
        } else if (state === "escalated") {
            _.extend(params, {filters: {tickleDate: null, }});
        }
        else {
            state = stateEnum[state.toUpperCase()];
            _.extend(params, {filters: {state, tickleDate: null, escalateReason: null}});
        }

        //adding query options
        if (acctNum) {
            _.extend(params.filters, {acctNum: {'$regex': acctNum, '$options': 'i'}});
        }
        if (facilityId) {
            _.extend(params.filters, {facilityId});
        }
        if (clientId) {
            _.extend(params.filters, {clientId});
        }
    }

    static getRange(page, perPage) {
        const lowest = (page - 1) * perPage + 1;
        const highest = lowest + perPage - 1;
        return {lowest, highest};
    }

    static getPagerOptions(page, perPage) {
        return {
            limit: perPage,
            skip: perPage * (page - 1)
        };
    }

    static setPage({page, perPage, total}, inc) {
        const maxPage = this.getMaxPage(total, perPage);
        if (page + inc <= maxPage && page + inc >= 1) {
            return page + inc;
        } else {
            return page;
        }
    }

    static getMaxPage(total, perPage) {
        return total % perPage ? total / perPage + 1 : total / perPage;
    }

}
