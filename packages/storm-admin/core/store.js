class Store {
    constructor() {
        this.plugins = {};
    }

    register(name, plugin) {
        if (this.plugins[name]) {
            throw `There is an already registered plugin with the same name: ${name}`;
        }

        this.plugins[name] = plugin;
    }
}

export default new Store();