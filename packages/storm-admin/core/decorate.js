import DecoratorContext from './lib/DecoratorContext';

export default (component, config) => {
    // return newly formed component | function
    const context = new DecoratorContext(component, config);

    return function (props) {
        const storm = context.build(props);

        return React.createElement(component, {
            ...props,
            storm
        });
    }
}
