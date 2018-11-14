import roleEnums from '../../roleEnums'

export default [
    {
        name: "dashboard",
        label: "Dashboard",
        icon: "dashboard",
        route: "/dashboard",
        roles: roleEnums.Everyone
    },
    {
        name: "accounts/active",
        label: "Active",
        icon: "user",
        route: "/accounts/active",
        roles: roleEnums.Everyone
    },
    {
        name: "accounts/review",
        label: "Review",
        icon: "inbox",
        route: "/accounts/review",
        roles: roleEnums.AccountWorkers
    },
    {
        name: "accounts/hold",
        label: "On Hold",
        icon: "hand-paper-o",
        route: "/accounts/hold",
        roles: [roleEnums.Manager, roleEnums.TeamLead]
    },
    {
        name: "accounts/archived",
        label: "Archived",
        icon: "archive",
        route: "/accounts/archived",
        roles: [roleEnums.Manager, roleEnums.TeamLead]
    },
    {
        name: "accounts/tickles",
        label: "Tickles",
        icon: "comments-o",
        route: "/accounts/tickles",
        roles: roleEnums.AccountWorkers
    },
    {
        name: "accounts/escalated",
        label: "Escalations",
        icon: "info",
        route: "/accounts/escalated",
        roles: [roleEnums.AccountWorkers]
    },
    {
        name: "flagged",
        label: "Flagged",
        icon: "flag",
        route: "/flagged",
        roles: [roleEnums.Manager]
    },
    {
        name: "accounts/unassigned",
        label: "Unassigned",
        icon: "question-circle-o",
        route: "/accounts/unassigned",
        roles: [roleEnums.Manager]
    },
    {
        name: "client/list",
        label: "Clients",
        icon: "users",
        route: "/client/list",
        roles: [roleEnums.Admin, roleEnums.Tech, roleEnums.Manager]
    },
    {
        name: "admin/user/list",
        label: "Users",
        icon: "user-circle-o",
        route: "/admin/user/list",
        roles: [roleEnums.Admin]
    },
    {
        name: "rules/list",
        label: "Rules",
        icon: "file-text-o",
        route: "#",
        roles: [roleEnums.Admin, roleEnums.Tech, roleEnums.Manager]
    },
    {
        name: "code/list",
        label: "Codes",
        icon: "code-fork",
        route: "/code/list",
        roles: [roleEnums.Admin]
    },
    {
        name: "reports/list",
        label: "Reports",
        icon: "file-text-o",
        route: "/reports/list",
        roles: [roleEnums.Admin, roleEnums.Tech, roleEnums.Manager]
    },
    {
        name: "letter-templates/list",
        label: "Templates",
        icon: "window-restore",
        route: "/letter-templates/list",
        roles: [roleEnums.Admin, roleEnums.Tech]
    },
    {
        name: "/letters/list",
        label: "Letters",
        icon: "copy",
        route: "/letters/list",
        roles: [roleEnums.Admin, roleEnums.Tech]
    },
    {
        name: "action/list",
        label: "Actions",
        icon: "thumb-tack",
        route: "/action/list",
        roles: [roleEnums.Admin, roleEnums.Tech]
    },
    {
        name: "substate/list",
        label: "Substates",
        icon: "tasks",
        route: "/substate/list",
        roles: [roleEnums.Admin]
    },
    
    {
        name: "tags/list",
        label: "Tags",
        icon: "tags",
        route: "/tags/list",
        roles: [roleEnums.Admin, roleEnums.Tech, roleEnums.Manager]
    },
    {
        name: "file/list",
        label: "Files",
        icon: "copy",
        route: "/file/list",
        roles: [roleEnums.Admin, roleEnums.Tech]
    },
];