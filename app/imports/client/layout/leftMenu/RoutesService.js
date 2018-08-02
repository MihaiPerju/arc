import RolesEnum from "../../../api/users/enums/roles";
import moment from "moment";

export default class RouteService {
  static getRoutesByRole() {
    if (Roles.userIsInRole(Meteor.userId(), RolesEnum.ADMIN)) {
      return [
        { name: "dashboard", label: "Dashboard", icon: "dashboard" },
        { name: "accounts/active", label: "Active", icon: "user" },
        { name: "accounts/review", label: "Review", icon: "inbox" },
        { name: "accounts/hold", label: "On Hold", icon: "hand-paper-o" },
        { name: "accounts/archived", label: "Archived", icon: "archive" },
        { name: "accounts/tickles", label: "Tickles", icon: "comments-o" },
        {
          name: "accounts/unassigned",
          label: "Unassigned",
          icon: "question-circle-o"
        },
        { name: "client/list", label: "Clients", icon: "users" },
        { name: "admin/user/list", label: "Users", icon: "user-circle-o" },
        { name: "code/list", label: "Codes", icon: "code-fork" },
        { name: "reports/list", label: "Reports", icon: "file-text-o" },
        {
          name: "letter-templates/list",
          label: "Templates",
          icon: "window-restore"
        },
        {
          name: "/letter-management/list",
          label: "Letters",
          icon: "copy"
        },
        { name: "action/list", label: "Actions", icon: "thumb-tack" },
        { name: "substate/list", label: "Substates", icon: "tasks" },
        { name: "module-tags/list", label: "Module Tags", icon: "tags" }
      ];
    } else if (Roles.userIsInRole(Meteor.userId(), RolesEnum.TECH)) {
      return [
        { name: "dashboard", label: "Dashboard", icon: "dashboard" },
        { name: "accounts/active", label: "Active", icon: "user" },
        { name: "accounts/review", label: "Review", icon: "inbox" },
        { name: "accounts/hold", label: "On Hold", icon: "hand-paper-o" },
        { name: "accounts/archived", label: "Archived", icon: "archive" },
        {
          name: "accounts/escalated",
          label: "Escalations",
          icon: "info"
        },
        {
          name: "accounts/tickles",
          label: "Tickles",
          icon: "comments-o"
        },
        {
          name: "accounts/unassigned",
          label: "Unassigned",
          icon: "question-circle-o"
        },
        { name: "client/list", label: "Clients", icon: "users" },
        { name: "admin/user/list", label: "Users", icon: "user-circle-o" },
        { name: "code/list", label: "Codes", icon: "code-fork" },
        { name: "reports/list", label: "Reports", icon: "file-text-o" },
        {
          name: "letter-templates/list",
          label: "Templates",
          icon: "window-restore"
        },
        {
          name: "/letter-management/list",
          label: "Letters",
          icon: "copy"
        },
        { name: "action/list", label: "Actions", icon: "thumb-tack" },
        { name: "module-tags/list", label: "Module Tags", icon: "tags" }
      ];
    } else if (Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) {
      return [
        { name: "dashboard", label: "Dashboard", icon: "dashboard" },
        { name: "accounts/active", label: "Active", icon: "user" },
        { name: "accounts/review", label: "Review", icon: "inbox" },
        { name: "accounts/hold", label: "On Hold", icon: "hand-paper-o" },
        { name: "accounts/archived", label: "Archived", icon: "archive" },
        {
          name: "accounts/escalated",
          label: "Escalations",
          icon: "info"
        },
        {
          name: "accounts/tickles",
          label: "Tickles",
          icon: "comments-o"
        },
        {
          name: "accounts/unassigned",
          label: "Unassigned",
          icon: "question-circle-o"
        },
        { name: "client/list", label: "Clients", icon: "users" },
        { name: "admin/user/list", label: "Users", icon: "user-circle-o" },
        { name: "reports/list", label: "Reports", icon: "file-text-o" },
        {
          name: "/letter-management/list",
          label: "Letters",
          icon: "copy"
        },
        { name: "action/list", label: "Actions", icon: "thumb-tack" },
        { name: "tag/list", label: "Tags", icon: "tags" },
        { name: "flagged-account/list", label: "Flagged Accounts", icon: "user" }
      ];
    } else {
      return [
        { name: "dashboard", label: "Dashboard", icon: "dashboard" },
        { name: "accounts/active", label: "Active", icon: "user" },
        { name: "accounts/review", label: "Review", icon: "inbox" },
        {
          name: "accounts/escalated",
          label: "Escalations",
          icon: "info"
        },
        {
          name: "accounts/tickles",
          label: "Tickles",
          icon: "comments-o"
        }
      ];
    }
  }
}
