export default class PagerService {
    static setQuery(query, {page, perPage}) {
        const params = this.getPagerOptions(page, perPage);
        return query.clone(params);
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
