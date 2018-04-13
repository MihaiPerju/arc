import RolesEnum from "../../../api/users/enums/roles";
import moment from 'moment';

export default class RouteService {
    static getRoutesByRole({unassigned, escalations, tickles}) {
        if (Roles.userIsInRole(Meteor.userId(), RolesEnum.ADMIN)) {
            return [
                {name: "dashboard", label: "Dashboard", icon: "dashboard"},
                {name: "accounts/active", label: "Account", icon: 'user'},
                {name: "accounts/review", label: "Review", icon: 'inbox'},
                {name: "accounts/hold", label: "On Hold", icon: 'hand-paper-o'},
                {name: "accounts/archived", label: "Archived", icon: 'archive'},
                {name: "accounts/escalated", label: "Escalations", icon: 'info', badge: escalations},
                {name: "accounts/tickles", label: "Tickles", icon: 'comments-o', badge: tickles},
                {name: "accounts/unassigned", label: "Unassigned", icon: 'question-circle-o', badge: unassigned},
                {name: "client/list", label: "Clients", icon: 'users'},
                {name: "admin/user/list", label: "User management", icon: 'user-circle-o'},
                {name: "code/list", label: "Codes", icon: 'code-fork'},
                {name: "reports/list", label: "Reports", icon: 'file-text-o'},
                {name: "letter-templates/list", label: "Templates", icon: 'window-restore'},
                {name: "action/list", label: "Actions", icon: 'thumb-tack'}
            ];
        } else if (Roles.userIsInRole(Meteor.userId(), RolesEnum.TECH)) {
            return [
                {name: "dashboard", label: "Dashboard", icon: "dashboard"},
                {name: "accounts/active", label: "Account", icon: 'user'},
                {name: "accounts/review", label: "Review", icon: 'inbox'},
                {name: "accounts/hold", label: "On Hold", icon: 'hand-paper-o'},
                {name: "accounts/archived", label: "Archived", icon: 'archive'},
                {name: "accounts/escalated", label: "Escalations", icon: 'info', badge: escalations},
                {name: "accounts/tickles", label: "Tickles", icon: 'comments-o', badge: tickles},
                {name: "accounts/unassigned", label: "Unassigned", icon: 'question-circle-o', badge: unassigned},
                {name: "client/list", label: "Clients", icon: 'users'},
                {name: "admin/user/list", label: "User management", icon: 'user-circle-o'},
                {name: "code/list", label: "Codes", icon: 'code-fork'},
                {name: "reports/list", label: "Reports", icon: 'file-text-o'},
                {name: "letter-templates/list", label: "Templates", icon: 'window-restore'},
                {name: "action/list", label: "Actions", icon: 'thumb-tack'}
            ];
        } else if (Roles.userIsInRole(Meteor.userId(), RolesEnum.MANAGER)) {
            return [
                {name: "dashboard", label: "Dashboard", icon: "dashboard"},
                {name: "accounts/active", label: "Account", icon: 'user'},
                {name: "accounts/review", label: "Review", icon: 'inbox'},
                {name: "accounts/hold", label: "On Hold", icon: 'hand-paper-o'},
                {name: "accounts/archived", label: "Archived", icon: 'archive'},
                {name: "accounts/escalated", label: "Escalations", icon: 'info', badge: escalations},
                {name: "accounts/tickles", label: "Tickles", icon: 'comments-o', badge: tickles},
                {name: "accounts/unassigned", label: "Unassigned", icon: 'question-circle-o', badge: unassigned},
                {name: "client/list", label: "Clients", icon: 'users'},
                {name: "admin/user/list", label: "User management", icon: 'user-circle-o'},
                {name: "code/list", label: "Codes", icon: 'code-fork'},
                {name: "reports/list", label: "Reports", icon: 'file-text-o'},
                {name: "letter-templates/list", label: "Templates", icon: 'window-restore'},
                {name: "action/list", label: "Actions", icon: 'thumb-tack'}
            ];
        } else {
            return [
                {name: "dashboard", label: "Dashboard", icon: "dashboard"},
                {name: "accounts/active", label: "Account", icon: 'user'},
                {name: "accounts/review", label: "Review", icon: 'inbox'},
                {name: "accounts/escalated", label: "Escalations", icon: 'info', badge: escalations},
                {name: "accounts/tickles", label: "Tickles", icon: 'comments-o', badge: tickles},
                {name: "reports/list", label: "Reports", icon: 'file-text-o'},
            ];
        }
    }

    static countBadges(data) {
        let unassigned = 0;
        let escalations = 0;
        let tickles = 0;
        let today = moment();

        let startOfDay = moment(today).startOf("day");
        startOfDay = startOfDay.add(1, "day");

        for (account of data) {

            if (!account.assigneeId && !account.workQueue) {
                unassigned++;
            }
            if (account.escalateReason) {
                escalations++;
            }
            if (account.tickleDate && startOfDay.isAfter(account.tickleDate)) {
                tickles++;
            }
        }
        return {tickles, escalations, unassigned};
    }
}