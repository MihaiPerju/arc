export default class {
    constructor(props, plugins) {
        this.components = {};
        this.api = {};

        plugins.forEach(plugin => {
            plugin.build(this, props);
        })
    }

    addComponent(name, component) {
        this.components[name] = component;
    }

    addAPI(name, api) {
        this.api[name] = api;
    }
}