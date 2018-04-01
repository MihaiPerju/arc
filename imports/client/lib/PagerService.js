import stateEnum from '/imports/api/tasks/enums/states';

export default class PagerService {
    static setQuery(query, {page, perPage, state, assign}) {
        const params = this.getPagerOptions(page, perPage);
        if (state) {
            this.getAccountFilters(state, params);
            this.getProperAccounts(params, assign);
        }
        return query.clone(params);
    }

    static getProperAccounts(params, assign) {
        if (assign === 'workQueue') {
            _.extend(params.filters, {assigneeId: null});
        }
        else {
            _.extend(params.filters, {workQueue: null});
        }
    }

    static getAccountFilters(state, params) {
        if (state === "unassigned") {
            _.extend(params, {filters: {assigneeId: null, tickleDate: null, escalateReason: null}});
        } else if (state === "tickles") {
            _.extend(params, {filters: {tickleDate: {$exists: true}, escalateReason: null}});
        } else if (state === "escalated") {
            _.extend(params, {filters: {tickleDate: null, escalateReason: {$exists: true}}});
        }
        else {
            state = stateEnum[state.toUpperCase()];
            _.extend(params, {filters: {state, tickleDate: null, escalateReason: null}});
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
