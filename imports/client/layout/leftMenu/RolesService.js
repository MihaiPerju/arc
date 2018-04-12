import RolesEnum from "../../../api/users/enums/roles";

export default class RouteService {
    static getRoutesByRole(data) {
        if (Roles.userIsInRole(Meteor.userId(), RolesEnum.ADMIN)) {
            return [
                {name: "accounts/active", label: "Account", icon: 'user'},
                {name: "accounts/review", label: "Review", icon: 'inbox'},
                {name: "accounts/hold", label: "On Hold", icon: 'hand-paper-o'},
                {name: "accounts/archived", label: "Archived", icon: 'archive'},
                {name: "accounts/escalated", label: "Escalations", icon: 'info'},
                {name: "accounts/tickles", label: "Tickles", icon: 'comments-o', badge: data.length},
                {name: "accounts/unassigned", label: "Unassigned", icon: 'question-circle-o'},
                {name: "home", label: "Dashboard", icon: ''},
                {name: "client/list", label: "Clients", icon: 'users'},
                {name: "admin/user/list", label: "User management", icon: 'user-circle-o'},
                {name: "code/list", label: "Codes", icon: 'code-fork'},
                {name: "reports/list", label: "Reports", icon: 'file-text-o'},
                {name: "letter-templates/list", label: "Templates", icon: 'window-restore'},
                {name: "action/list", label: "Actions", icon: 'thumb-tack'}
            ];
        } else if (Roles.userIsInRole(Meteor.userId(), RolesEnum.TECH)) {
            return [
                {name: "accounts/active", label: "Account", icon: 'user'},
                {name: "accounts/review", label: "Review", icon: 'inbox'},
                {name: "accounts/hold", label: "On Hold", icon: 'hand-paper-o'},
                {name: "accounts/archived", label: "Archived", icon: 'archive'},
                {name: "accounts/escalated", label: "Escalations", icon: 'info'},
                {name: "accounts/tickles", label: "Tickles", icon: 'comments-o', badge: data.length},
                {name: "accounts/unassigned", label: "Unassigned", icon: 'question-circle-o'},
                {name: "home", label: "Dashboard", icon: ''},
                {name: "client/list", label: "Clients", icon: 'users'},
                {name: "admin/user/list", label: "User management", icon: 'user-circle-o'},
                {name: "code/list", label: "Codes", icon: 'code-fork'},
                {name: "reports/list", label: "Reports", icon: 'file-text-o'},
                {name: "letter-templates/list", label: "Templates", icon: 'window-restore'},
                {name: "action/list", label: "Actions", icon: 'thumb-tack'}
            ];
        } else if (Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) {
            return  [
                {name: "accounts/active", label: "Account", icon: 'user'},
                {name: "accounts/review", label: "Review", icon: 'inbox'},
                {name: "accounts/hold", label: "On Hold", icon: 'hand-paper-o'},
                {name: "accounts/archived", label: "Archived", icon: 'archive'},
                {name: "accounts/escalated", label: "Escalations", icon: 'info'},
                {name: "accounts/tickles", label: "Tickles", icon: 'comments-o', badge: data.length},
                {name: "accounts/unassigned", label: "Unassigned", icon: 'question-circle-o'},
                {name: "home", label: "Dashboard", icon: ''},
                {name: "client/list", label: "Clients", icon: 'users'},
                {name: "admin/user/list", label: "User management", icon: 'user-circle-o'},
                {name: "code/list", label: "Codes", icon: 'code-fork'},
                {name: "reports/list", label: "Reports", icon: 'file-text-o'},
                {name: "letter-templates/list", label: "Templates", icon: 'window-restore'},
                {name: "action/list", label: "Actions", icon: 'thumb-tack'}
            ];
        } else {
            return [
                {name: "accounts/active", label: "Account", icon: 'user'},
                {name: "accounts/review", label: "Review", icon: 'inbox'},
                {name: "accounts/escalated", label: "Escalations", icon: 'info'},
                {name: "accounts/tickles", label: "Tickles", icon: 'comments-o', badge: data.length},
                {name: "accounts/unassigned", label: "Unassigned", icon: 'question-circle-o'},
                {name: "home", label: "Dashboard", icon: ''},
                {name: "reports/list", label: "Reports", icon: 'file-text-o'},
            ];
        }
    }
}