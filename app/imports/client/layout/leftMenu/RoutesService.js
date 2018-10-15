import RolesEnum from "../../../api/users/enums/roles";

export default class RouteService {
  static getRoutesByRole() {
    if (Roles.userIsInRole(Meteor.userId(), RolesEnum.ADMIN)) {
      return [{
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
          name: "rules/list",
          label: "Rules",
          icon: "file-text-o"
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
          name: "tags/list",
          label: "Tags",
          icon: "tags"
        }
      ];
    } else if (Roles.userIsInRole(Meteor.userId(), RolesEnum.TECH)) {
      return [{
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
          name: "tags/list",
          label: "Tags",
          icon: "tags"
        }
      ];
    } else if (Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) {
      return [{
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
      return [{
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

      case "/accounts/active":
        {
          return "Active Accounts";

        }
      case "/accounts/review":
        {
          return "Accounts In Review";

        }
      case "/accounts/hold":
        {
          return "Accounts on Hold";

        }
      case "/accounts/archived":
        {
          return "Archived Accounts";

        }
      case "/accounts/tickles":
        {
          return "Tickled Accounts";

        }
      case "/accounts/escalated":
        {
          return "Escalated Accounts";

        }
      case "/flagged":
        {
          return "Escalated Accounts";

        }
      case "/accounts/unassigned":
        {
          return "Unassigned Accounts";

        }
      case "/client/list":
        {
          return "Clients";

        }
      case "/admin/user/list":
        {
          return "Users";

        }
      case "/code/list":
        {
          return "Reason Codes";

        }
      case "/reports/list":
        {
          return "Reports";

        }
      case "/letter-templates/list":
        {
          return "Letter Templates";

        }
      case "/letters/list":
        {
          return "Letters";

        }
      case "/action/list":
        {
          return "Actions";

        }
      case "/substate/list":
        {
          return "Substates";

        }
      case "/tags/list":
        {
          return "Tags";

        }
      case "/tag/list":
        {
          return "Work Queues";

        }
      case "/file/list":
        {
          return "Files";


        }
      case "/admin/settings":
        {
          return "Settings";


        }
      default:
        break;
    }
  }
}