import RolesEnum from "../../../api/users/enums/roles";
import moment from "moment";

export default class RouteService {
  static getRoutesByRole() {
    if (Roles.userIsInRole(Meteor.userId(), RolesEnum.ADMIN)) {
      return [
        {
          name: "dashboard",
          label: "Dashboard",
          icon: "dashboard"
        },
        {
          name: "accounts/active",
          label: "Active",
          icon: "user"
        },
        {
          name: "accounts/review",
          label: "Review",
          icon: "inbox"
        },
        {
          name: "accounts/hold",
          label: "On Hold",
          icon: "hand-paper-o"
        },
        {
          name: "accounts/archived",
          label: "Archived",
          icon: "archive"
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
        {
          name: "client/list",
          label: "Clients",
          icon: "users"
        },
        {
          name: "admin/user/list",
          label: "Users",
          icon: "user-circle-o"
        },
        {
          name: "code/list",
          label: "Codes",
          icon: "code-fork"
        },
        {
          name: "reports/list",
          label: "Reports",
          icon: "file-text-o"
        },
        {
          name: "letter-templates/list",
          label: "Templates",
          icon: "window-restore"
        },
        {
          name: "/letters/list",
          label: "Letters",
          icon: "copy"
        },
        {
          name: "action/list",
          label: "Actions",
          icon: "thumb-tack"
        },
        {
          name: "substate/list",
          label: "Substates",
          icon: "tasks"
        },
        {
          name: "module-tags/list",
          label: "Tags",
          icon: "tags"
        }
      ];
    } else if (Roles.userIsInRole(Meteor.userId(), RolesEnum.TECH)) {
      return [
        {
          name: "dashboard",
          label: "Dashboard",
          icon: "dashboard"
        },
        {
          name: "accounts/active",
          label: "Active",
          icon: "user"
        },
        {
          name: "accounts/review",
          label: "Review",
          icon: "inbox"
        },
        {
          name: "accounts/hold",
          label: "On Hold",
          icon: "hand-paper-o"
        },
        {
          name: "accounts/archived",
          label: "Archived",
          icon: "archive"
        },
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
        {
          name: "file/list",
          label: "Files",
          icon: "copy"
        },
        {
          name: "client/list",
          label: "Clients",
          icon: "users"
        },
        {
          name: "admin/user/list",
          label: "Users",
          icon: "user-circle-o"
        },
        {
          name: "code/list",
          label: "Codes",
          icon: "code-fork"
        },
        {
          name: "reports/list",
          label: "Reports",
          icon: "file-text-o"
        },
        {
          name: "letter-templates/list",
          label: "Templates",
          icon: "window-restore"
        },
        {
          name: "/letters/list",
          label: "Letters",
          icon: "copy"
        },
        {
          name: "action/list",
          label: "Actions",
          icon: "thumb-tack"
        },
        {
          name: "module-tags/list",
          label: "Tags",
          icon: "tags"
        }
      ];
    } else if (Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) {
      return [
        {
          name: "dashboard",
          label: "Dashboard",
          icon: "dashboard"
        },
        {
          name: "accounts/active",
          label: "Active",
          icon: "user"
        },
        {
          name: "accounts/review",
          label: "Review",
          icon: "inbox"
        },
        {
          name: "accounts/hold",
          label: "On Hold",
          icon: "hand-paper-o"
        },
        {
          name: "accounts/archived",
          label: "Archived",
          icon: "archive"
        },
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
        {
          name: "flagged",
          label: "Flagged",
          icon: "flag"
        },
        {
          name: "client/list",
          label: "Clients",
          icon: "users"
        },
        {
          name: "admin/user/list",
          label: "Users",
          icon: "user-circle-o"
        },
        {
          name: "reports/list",
          label: "Reports",
          icon: "file-text-o"
        },
        {
          name: "/letters/list",
          label: "Letters",
          icon: "copy"
        },
        {
          name: "action/list",
          label: "Actions",
          icon: "thumb-tack"
        },
        {
          name: "tag/list",
          label: "Work Queues",
          icon: "tags"
        }
      ];
    } else {
      return [
        {
          name: "dashboard",
          label: "Dashboard",
          icon: "dashboard"
        },
        {
          name: "accounts/active",
          label: "Active",
          icon: "user"
        },
        {
          name: "accounts/review",
          label: "Review",
          icon: "inbox"
        },
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

  static getRouteName(path) {
    switch (path) {
      case "/dashboard":
        return "Dashboard";
        break;
      case "/accounts/active": {
        return "Active Accounts";
        break;
      }
      case "/accounts/review": {
        return "Accounts In Review";
        break;
      }
      case "/accounts/hold": {
        return "Accounts on Hold";
        break;
      }
      case "/accounts/archived": {
        return "Archived Accounts";
        break;
      }
      case "/accounts/tickles": {
        return "Tickled Accounts";
        break;
      }
      case "/accounts/escalated": {
        return "Escalated Accounts";
        break;
      }
      case "/flagged": {
        return "Escalated Accounts";
        break;
      }
      case "/accounts/unassigned": {
        return "Unassigned Accounts";
        break;
      }
      case "/client/list": {
        return "Clients";
        break;
      }
      case "/admin/user/list": {
        return "Users";
        break;
      }
      case "/code/list": {
        return "Reason Codes";
        break;
      }
      case "/reports/list": {
        return "Reports";
        break;
      }
      case "/letter-templates/list": {
        return "Letter Templates";
        break;
      }
      case "/letters/list": {
        return "Letters";
        break;
      }
      case "/action/list": {
        return "Actions";
        break;
      }
      case "/substate/list": {
        return "Substates";
        break;
      }
      case "/module-tags/list": {
        return "Tags";
        break;
      }
      case "/tag/list": {
        return "Work Queues";
        break;
      }
      case "/file/list": {
        return "Files";
        break;
      }
      default:
        break;
    }
  }
}
