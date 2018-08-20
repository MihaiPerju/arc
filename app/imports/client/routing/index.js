import React from "react";
import {
  render
} from "react-dom";

import route from "./router";
import "./logoutRoute";
import Home from "/imports/client/pages/home/Home";

//User
import MyProfile from '/imports/client/pages/users/MyProfile';
import ActivityStream from '/imports/client/pages/users/ActivityStream';
import ChangePassword from '/imports/client/pages/users/ChangePassword';
import ForgotPassword from '/imports/client/pages/users/ForgotPassword';
import ResetPassword from '/imports/client/pages/users/ResetPassword.jsx';
import Login from '/imports/client/pages/users/Login';
import Dashboard from '/imports/client/pages/users/Dashboard';

route('/dashboard', Home, {}, {
  name: 'dashboard',

});
route('/', Login, {}, {
  name: 'login',

});
route('/my-profile', MyProfile, {}, {
  name: 'profile',
});
route('/:userId/activity', ActivityStream);
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
import UserListContainer from '/imports/client/pages/admin/UserListContainer.jsx';
import CreateUser from '/imports/client/pages/admin/CreateUser.jsx';
import EditUser from '/imports/client/pages/admin/EditUser.jsx';
import Settings from "/imports/client/pages/admin/Settings";

route("/admin/settings", Settings);
route('/admin/user/list', UserListContainer);
route('/admin/user/create', CreateUser);
route('/admin/user/:userId/edit', EditUser);

//Clients
import CreateClient from "/imports/client/pages/clients/ClientCreate";
import EditClient from "/imports/client/pages/clients/ClientEdit";
import ClientListContainer from "/imports/client/pages/clients/ClientListContainer";

route("/client/create", CreateClient);
route("/client/:userId/edit", EditClient);
route("/client/list", ClientListContainer);

//Letter templates
import LetterTemplatesListContainer from "/imports/client/pages/letterTemplates/LetterTemplatesListContainer";
import LetterTemplateCreate from "/imports/client/pages/letterTemplates/LetterTemplateCreate";
import LetterTemplateEdit from "/imports/client/pages/letterTemplates/LetterTemplateEdit";

route("/letter-templates/list", LetterTemplatesListContainer);
route("/letter-template/:id/edit", LetterTemplateEdit);
route("/letter-template/create", LetterTemplateCreate);

//Letter
import LetterCreateContainer from "/imports/client/pages/letters/LetterCreateContainer.jsx";
import LetterView from "/imports/client/pages/letters/LetterView.jsx";

route(
  "/account/:accountId/create-letter",
  LetterCreateContainer, {}, {
    name: "letter.create"
  }
);
route(
  "/account/:accountId/letter/:letterId/view",
  LetterView, {}, {
    name: "letter.view"
  }
);

//Facilities
import FacilityContainer from "/imports/client/pages/clients/facilities/FacilityContainer.jsx";
import FacilityCreate from "/imports/client/pages/clients/facilities/FacilityCreate.jsx";
import FacilityEdit from "/imports/client/pages/clients/facilities/FacilityEdit.jsx";

route(
  "/client/:_id/manage-facilities",
  FacilityContainer, {}, {
    name: "facility.list"
  }
);
route(
  "/client/:_id/manage-facilities/create",
  FacilityCreate, {}, {
    name: "facility.create"
  }
);
route(
  "/client/:_id/manage-facilities/:facilityId/edit",
  FacilityEdit, {}, {
    name: "facility.edit"
  }
);

//Codes
import CodeListContainer from "/imports/client/pages/codes/CodeListContainer";
import CodeEdit from "/imports/client/pages/codes/CodeEdit";
import CodeCreate from "/imports/client/pages/codes/CodeCreate";

route("/code/list", CodeListContainer);
route("/code/:id/edit", CodeEdit);
route("/code/create", CodeCreate);

//Accounts
import AccountListContainer from "/imports/client/pages/accounts/AccountListContainer";

// route('/accounts', AccountListContainer);
route("/accounts/:state?", AccountListContainer);

//Actions
import ActionListContainer from "/imports/client/pages/actions/ActionListContainer.jsx";

route("/action/list", ActionListContainer);
route("/action/:id/edit", ActionListContainer);

//Regions
import RegionListContainer from "/imports/client/pages/regions/RegionsListContainer";

route(
  "/client/:id/region/list",
  RegionListContainer, {}, {
    name: "region.list"
  }
);

//Reports
import AccountFilterBuilder from "/imports/client/pages/reports/AccountFilterBuilder";
import ReportListContainer from "/imports/client/pages/reports/ReportListContainer";
import ReportCreate from "/imports/client/pages/reports/ReportCreate";

route("/accounts/filter-builder", AccountFilterBuilder);
route("/reports/list", ReportListContainer);
route(
  "/report/create/facilityid/:facilityId",
  ReportCreate, {}, {
    name: "report.create.facilityid"
  }
);

//Insurance Companies
import InsuranceCompanyCreate from "/imports/client/pages/insuranceCompanies/InsuranceCompanyCreate";
import InsuranceCompanyEdit from "/imports/client/pages/insuranceCompanies/InsuranceCompanyEdit";
import InsuranceCompanyListContainer from "/imports/client/pages/insuranceCompanies/InsuranceCompanyListContainer";

route("/inscompany/create", InsuranceCompanyCreate);
route("/inscompany/:id/edit", InsuranceCompanyEdit);
route("/inscompany/list", InsuranceCompanyListContainer);

//Reason Codes
import ReasonCodesContainer from "/imports/client/pages/reasonCodes/ReasonCodesContainer";
import ReasonCodeCreate from "/imports/client/pages/reasonCodes/ReasonCodeCreate";
import ReasonCodeEdit from "/imports/client/pages/reasonCodes/ReasonCodeEdit";

route("/reason-codes/list", ReasonCodesContainer);
route("/reason-code/create", ReasonCodeCreate);
route("/reason-code/:id/edit", ReasonCodeEdit);

//Rules Engine
import RulesContainer from "/imports/client/pages/rules/RulesListContainer";
import RuleCreate from "/imports/client/pages/rules/RuleCreate";
import RuleEdit from "/imports/client/pages/rules/RuleEdit";

route("/rules/list", RulesContainer);
route("/rule/create", RuleCreate);
route("/rule/:id/edit", RuleEdit);

//Tags
import TagListContainer from "/imports/client/pages/tags/TagListContainer.jsx";

route("/tag/list", TagListContainer);

//Substates
import SubstatesListContainer from "/imports/client/pages/substates/SubstatesListContainer";

route("/substate/list", SubstatesListContainer);

//Letter management
import LetterListContainer from "/imports/client/pages/letterManagement/LetterListContainer.jsx";

route("/letter-management/list", LetterListContainer);

//Module tagging
import ModuleTagsListContainer from "/imports/client/pages/moduleTags/ModuleTagsListContainer.jsx";

route("/module-tags/list", ModuleTagsListContainer);


//Flagged accounts
import FlaggedAccountListContainer from "/imports/client/pages/accounts/FlaggedAccountListContainer";

route("/flagged", FlaggedAccountListContainer);