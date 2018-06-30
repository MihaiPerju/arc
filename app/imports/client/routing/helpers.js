import router from './router';

/**
 * Create a page specific css class from route name and append to  document body
 */

let addPageClass = () => {
    const routeName = router.current().route.name;
    let routeClass = routeName && routeName.replace(/_|\./g, "-");
    document.body.classList.add(`cc-${routeClass}-page`);
};

/**
 * Remove the page specific css class from document body
 */
let removePageClass = () => {
    const routeName = router.current().route.name;
    let routeClass = routeName && routeName.replace(/_|\./g, "-");
    document.body.classList.remove(`cc-${routeClass}-page`);
};

/**
 * Scroll Page to top when route changes
 */
let PageToTopOnRouteChange = () => {
    window.scrollTo(0, 0);
};

/**
 * Remove mobile menu open class from document body
 */
let removeMobileMenuClass = () => {
    document.body.classList.remove('cc-menu-open');
};

FlowRouter.triggers.enter([addPageClass, PageToTopOnRouteChange]);
FlowRouter.triggers.exit([removePageClass, removeMobileMenuClass]);

/**
 * Test if a route is active
 *
 * @param {string} route
 * @returns {boolean}
 */
let isCurrentRoute = (route) => {
    return router.current().route.name === route;
};

export default FlowHelpers = {
    isCurrentRoute,
};
