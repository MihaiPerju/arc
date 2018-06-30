import Plugin from '../lib/Plugin';
import DecoratorContext from '../lib/DecoratorContext';

class ListPlugin extends Plugin {
    /**
     * @param context {DecoratorContext}
     */
    constructor(context) {
        super();

        const { query, list } = context.config;

    }
}

import Store from '../store';
Store.register('list', ListPlugin);