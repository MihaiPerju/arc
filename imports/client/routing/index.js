import React from 'react';
import {render} from 'react-dom';
import {GrapherLive} from 'meteor/cultofcoders:grapher-live';

import route from './router';
import './logoutRoute';
import Home from '/imports/client/pages/Home';


//User
import Register from '/imports/client/pages/users/Register';
import MyProfile from '/imports/client/pages/users/MyProfile';
import ChangePassword from '/imports/client/pages/users/ChangePassword';
import ForgotPassword from '/imports/client/pages/users/ForgotPassword';
import ResetPassword from '/imports/client/pages/users/ResetPassword.jsx';
import Login from '/imports/client/pages/users/Login';

//Route action for grapher live
//Recommended to run this only in dev env
FlowRouter.route('/grapher-live', {
    action() {
        console.log(document.getElementById('grapher-live'));
        render(React.createElement(GrapherLive), document.body);
    }
});

route('/', Home, {}, {
    name: 'home',

});
route('/login', Login, {}, {
    name: 'login',

});
route('/register', Register, {}, {
    name: 'register',

});
route('/my-profile', MyProfile, {}, {
    name: 'profile',
});
route('/password/change', ChangePassword, {}, {
    name: 'password.change',

});
route('/password/forgot', ForgotPassword, {}, {
    name: 'password.forgot',

});
route('/password/reset/:token', ResetPassword, {}, {
    name: 'password.reset',

});


//Admin
import UserListContainer from '/imports/client/pages/admin/UserListContainer.jsx'
import CreateUser from '/imports/client/pages/admin/CreateUser.jsx'
import EditUser from '/imports/client/pages/admin/EditUser.jsx'

route('/admin/user/list', UserListContainer);
route('/admin/user/create', CreateUser);
route('/admin/user/:userId/edit', EditUser);

//Posts
import PostListContainer from '/imports/client/pages/posts/PostListContainer.jsx';
import CreatePost from '/imports/client/pages/posts/CreatePost.jsx';
import EditPost from '/imports/client/pages/posts/EditPost.jsx';

route('/post/list', PostListContainer);
route('/post/create', CreatePost);
route('/post/:postId/edit', EditPost);

//Clients
import CreateClient from '/imports/client/pages/clients/CreateClient';
import EditClient from '/imports/client/pages/clients/EditClient';

route('/client/create', CreateClient);
route('/client/:userId/edit',EditClient);