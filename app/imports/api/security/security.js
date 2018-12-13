import UserRoles from "/imports/api/users/enums/roles";

export default {
  checkAdmin(userId) {
    this.checkLoggedIn(userId);
    if (!Roles.userIsInRole(userId, UserRoles.ADMIN)) {
      throw new Meteor.Error("Not allowed !");
    }
  },

  checkLoggedIn(userId) {
    if (!userId) {
      throw new Meteor.Error("Not logged in !");
    }
  },

  isAdminOrTech(userId) {
    this.checkLoggedIn(userId);

    if (!Roles.userIsInRole(userId, [UserRoles.ADMIN, UserRoles.TECH])) {
      throw new Meteor.Error(
        "not-allowed",
        "You do not have the correct roles for this!"
      );
    }
  },

  isAllowed(userId, roles) {
    this.checkLoggedIn(userId);
    if (!Roles.userIsInRole(userId, roles)) {
      throw new Meteor.Error(
        "not-allowed",
        "You do not have the correct roles for this!"
      );
    }
  },

  checkIfAdmin(userId) {
    return Roles.userIsInRole(userId, [UserRoles.ADMIN]);
  },

  checkManager(userId) {
    this.checkLoggedIn(userId);
    if (!Roles.userIsInRole(userId, UserRoles.MANAGER)) {
      throw new Meteor.Error("Not allowed !");
    }
  },

  isAdminOrManager(userId) {
    this.checkLoggedIn(userId);

    if (!Roles.userIsInRole(userId, [UserRoles.ADMIN, UserRoles.MANAGER])) {
      throw new Meteor.Error(
        "not-allowed",
        "You do not have the correct roles for this!"
      );
    }
  },
};
