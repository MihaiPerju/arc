import React from 'react';
import NotificationsSystem from 'react-notification-system';
import Notifier from '/imports/client/lib/Notifier';
import Header from '/imports/client/layout/header/Header';
import Footer from '/imports/client/layout/footer/Footer';

export default ({main, routeProps}) => {
    // main represents the component to render passed from the router
    // route props represent the properties that it receives from the router

    // where we do createElement, that's where your components will get rendered.
    return (
        <div id="cc-app">
            <Header />
            {React.createElement(main, routeProps)}
            <Footer />

            <NotificationsSystem ref={ref => Notifier.setRef(ref)} />
        </div>
    )
}