import React from 'react';
import {render} from 'react-dom';

import route from './router';
import './logoutRoute';
import Home from '/imports/client/pages/home/Home';

//User
import MyProfile from '/imports/client/pages/users/MyProfile';
import ChangePassword from '/imports/client/pages/users/ChangePassword';
import ForgotPassword from '/imports/client/pages/users/ForgotPassword';
import ResetPassword from '/imports/client/pages/users/ResetPassword.jsx';
import Login from '/imports/client/pages/users/Login';
import Dashboard from '/imports/client/pages/users/Dashboard';

route('/home', Home, {}, {
    name: 'home',

});
route('/', Login, {}, {
    name: 'login',

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
route('/reset-password/:token', ResetPassword, {}, {
    name: 'password.reset',

});
route('/dashboard', Dashboard);

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
import CreateClient from '/imports/client/pages/clients/ClientCreate';
import EditClient from '/imports/client/pages/clients/ClientEdit';
import ClientListContainer from '/imports/client/pages/clients/ClientListContainer';
import ClientView from '/imports/client/pages/clients/ClientView';

route('/client/:userId/view', ClientView);
route('/client/create', CreateClient);
route('/client/:userId/edit', EditClient);
route('/client/list', ClientListContainer);

//Letter templates
import LetterTemplatesListContainer from '/imports/client/pages/letterTemplates/LetterTemplatesListContainer';
import LetterTemplateCreate from '/imports/client/pages/letterTemplates/LetterTemplateCreate';
import LetterTemplateEdit from '/imports/client/pages/letterTemplates/LetterTemplateEdit';

route('/letter-templates/list', LetterTemplatesListContainer);
route('/letter-template/:id/edit', LetterTemplateEdit);
route('/letter-template/create', LetterTemplateCreate);

//Letter
import LetterCreateContainer from "/imports/client/pages/letters/LetterCreateContainer.jsx"
import LetterView from "/imports/client/pages/letters/LetterView.jsx";

route('/task/:taskId/create-letter', LetterCreateContainer, {}, {
    name: 'letter.create'
});
route('/task/:taskId/letter/:letterId/view', LetterView, {}, {
    name: 'letter.view'
});

//Facilities
import FacilityListContainer from "/imports/client/pages/clients/facilities/FacilityListContainer.jsx";
import FacilityCreate from "/imports/client/pages/clients/facilities/FacilityCreate.jsx";
import FacilityEdit from "/imports/client/pages/clients/facilities/FacilityEdit.jsx";
import FacilityView from "/imports/client/pages/clients/facilities/FacilityView.jsx";

route('/client/:_id/manage-facilities', FacilityListContainer, {}, {
    name: 'facility.list'
});
route('/client/:_id/manage-facilities/create', FacilityCreate, {}, {
    name: 'facility.create'
});
route('/client/:_id/manage-facilities/:facilityId/edit', FacilityEdit, {}, {
    name: 'facility.edit'
});
route('/client/:_id/manage-facilities/:facilityId/view', FacilityView, {}, {
    name: 'facility.view'
});

//Codes
import CodeListContainer from '/imports/client/pages/codes/CodeListContainer';
import CodeEdit from '/imports/client/pages/codes/CodeEdit';
import CodeCreate from '/imports/client/pages/codes/CodeCreate';

route('/code/list', CodeListContainer);
route('/code/:id/edit', CodeEdit);
route('/code/create', CodeCreate);


//Tasks
import TaskListContainer from '/imports/client/pages/tasks/TaskListContainer';
import TaskViewContainer from '/imports/client/pages/tasks/TaskViewContainer';

route('/tasks', TaskListContainer);
route('/task/:_id/view', TaskViewContainer, {}, {
    name: 'task.view'
});

//Actions
import ActionListContainer from '/imports/client/pages/actions/ActionListContainer.jsx';
import CreateAction from '/imports/client/pages/actions/ActionCreate.jsx';
import EditAction from '/imports/client/pages/actions/ActionEdit.jsx';

route('/action/list', ActionListContainer);
route('/action/create', CreateAction);
route('/action/:actionId/edit', EditAction);

//Regions
import RegionCreate from '/imports/client/pages/regions/RegionCreate';
import RegionEdit from '/imports/client/pages/regions/RegionEdit';
import RegionListContainer from '/imports/client/pages/regions/RegionsListContainer';

route('/region/create', RegionCreate);
route('/region/:id/edit', RegionEdit);
route('/region/list', RegionListContainer);

//Reports
import TaskFilterBuilder from '/imports/client/pages/reports/TaskFilterBuilder';
import ReportListContainer from '/imports/client/pages/reports/ReportListContainer';
import ReportEdit from '/imports/client/pages/reports/ReportEdit';
import ReportManage from '/imports/client/pages/reports/ReportManage';
import ReportCreate from '/imports/client/pages/reports/ReportCreate';

route('/tasks/filter-builder', TaskFilterBuilder);
route('/reports/list', ReportListContainer);
route('/report/create', ReportCreate);
route('/report/:id/edit', ReportManage);

//Insurance Companies
import InsuranceCompanyCreate from '/imports/client/pages/insuranceCompanies/InsuranceCompanyCreate';
import InsuranceCompanyEdit from '/imports/client/pages/insuranceCompanies/InsuranceCompanyEdit';
import InsuranceCompanyListContainer from '/imports/client/pages/insuranceCompanies/InsuranceCompanyListContainer';

route('/inscompany/create', InsuranceCompanyCreate);
route('/inscompany/:id/edit', InsuranceCompanyEdit);
route('/inscompany/list', InsuranceCompanyListContainer);