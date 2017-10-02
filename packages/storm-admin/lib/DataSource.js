import EventEmitter from 'event-emitter';

export default class DataSource {
    constructor(query, params = {}) {
        this.query = query.clone(params);
        this.ee = new EventEmitter();
    }

    setParams(params) {
        this.query.setParams(params);
    }
}