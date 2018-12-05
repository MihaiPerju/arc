import roleEnums from '../../roleEnums'

export default [
    {
        label: "Dashboard",
        icon: "dashboard",
        route: "/dashboard",
        roles: roleEnums.Everyone
    },
    {
        label: "Active",
        icon: "user",
        route: "/accounts/active",
        roles: roleEnums.Everyone
    },
    {
        label: "Review",
        icon: "inbox",
        route: "/accounts/review",
        roles: roleEnums.AccountWorkers
    },
    {
        label: "On Hold",
        icon: "hand-paper-o",
        route: "/accounts/hold",
        roles: [roleEnums.Manager, roleEnums.TeamLead]
    },
    {
        label: "Archived",
        icon: "archive",
        route: "/accounts/archived",
        roles: [roleEnums.Manager, roleEnums.TeamLead]
    },
    {
        label: "Tickles",
        icon: "comments-o",
        route: "/accounts/tickles",
        roles: roleEnums.AccountWorkers
    },
    {
        label: "Escalations",
        icon: "info",
        route: "/accounts/escalated",
        roles: [roleEnums.AccountWorkers]
    },
    {
        label: "Flagged",
        icon: "flag",
        route: "/flagged",
        roles: [roleEnums.Manager]
    },
    {
        label: "Unassigned",
        icon: "question-circle-o",
        route: "/accounts/unassigned",
        roles: [roleEnums.Manager]
    },
    {
        label: "Clients",
        icon: "users",
        route: "/client/list",
        roles: [roleEnums.Admin, roleEnums.Tech, roleEnums.Manager]
    },
    {
        label: "Users",
        icon: "user-circle-o",
        route: "/admin/user/list",
        roles: [roleEnums.Admin]
    },
    {
        label: "Rules",
        icon: "file-text-o",
        route: "/rules/list",
        roles: [roleEnums.Admin, roleEnums.Tech, roleEnums.Manager]
    },
    {
        label: "Codes",
        icon: "code-fork",
        route: "/code/list",
        roles: [roleEnums.Admin]
    },
    {
        label: "Reports",
        icon: "file-text-o",
        route: "/reports/list",
        roles: [roleEnums.Admin, roleEnums.Tech, roleEnums.Manager]
    },
    {
        label: "Templates",
        icon: "window-restore",
        route: "/letter-templates/list",
        roles: [roleEnums.Admin, roleEnums.Tech]
    },
    {
        label: "Letters",
        icon: "copy",
        route: "/letters/list",
        roles: [roleEnums.Admin, roleEnums.Tech]
    },
    {
        label: "Actions",
        icon: "thumb-tack",
        route: "/action/list",
        roles: [roleEnums.Admin, roleEnums.Tech]
    },
    {
        label: "Substates",
        icon: "tasks",
        route: "/substate/list",
        roles: [roleEnums.Admin]
    },
    
    {
        label: "Tags",
        icon: "tags",
        route: "/tags/list",
        roles: [roleEnums.Admin, roleEnums.Tech, roleEnums.Manager]
    },
    {
        label: "Files",
        icon: "copy",
        route: "/file/list",
        roles: [roleEnums.Admin, roleEnums.Tech]
    },
];