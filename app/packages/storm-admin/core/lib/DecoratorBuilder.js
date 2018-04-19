import EventEmitter from 'event-emitter';
import { _ } from 'meteor/underscore';
import Store from '../store';

export default class DecoratorBuilder {
    constructor(component, config) {
        this.ee = new EventEmitter();
        this.component = component;
        this.config = config;

        this.plugins = _.pick(Store.plugins, _.keys(config));
    }

    build(props) {

    }
}