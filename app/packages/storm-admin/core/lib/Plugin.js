import EventEmitter from 'event-emitter';

export default class Plugin {
    constructor(context) {
        this.context = context;
        this.ee = new EventEmitter();
    }

    build(config) {
        throw 'Please override this method to be able to build your plugin';
    }
}