import React from "react";
import NotificationsSystem from "react-notification-system";
import Notifier from "/imports/client/lib/Notifier";
import Header from "/imports/client/layout/header/Header";
import LeftMenu from "/imports/client/layout/leftMenu/LeftMenu";
import Footer from "/imports/client/layout/footer/Footer";
import Login from "/imports/client/pages/users/Login";
import NotificationBar from "/imports/client/pages/home/components/NotificationBar";

export default ({ main, routeProps }) => {
  // main represents the component to render passed from the router
  // route props represent the properties that it receives from the router
  // where we do createElement, that's where your components will get rendered.
  if (Meteor.userId())
    return (
      <div id="cc-app">
        <Header />
        <NotificationBar />

        <main className="main-section">
          <LeftMenu />
          {React.createElement(main, routeProps)}
        </main>
        <NotificationsSystem ref={ref => Notifier.setRef(ref)} style={false} />
      </div>
    );
  return <Login />;
};
