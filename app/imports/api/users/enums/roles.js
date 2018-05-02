const userRoles = {
    ADMIN: 'admin',
    TECH: 'tech',
    REP: 'rep',
    MANAGER: 'manager'
};

const roleGroups = {
    ALL: [userRoles.ADMIN, userRoles.TECH, userRoles.MANAGER, userRoles.REP],
    ADMIN_TECH: [userRoles.ADMIN, userRoles.TECH],
    ADMIN_TECH_MANAGER: [userRoles.ADMIN, userRoles.TECH, userRoles.MANAGER],
    TECH_MANAGER: [userRoles.TECH, userRoles.MANAGER],
    MANAGER_REP: [userRoles.MANAGER, userRoles.REP]
};

export default userRoles;
export {roleGroups};