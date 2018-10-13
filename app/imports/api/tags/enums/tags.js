const tags = {
    CLIENTS: "clients",
    CODES: "codes",
    REPORTS: "ceports",
    TEMPLATES: "templates",
    LETTERS: "letters",
    ACTIONS: "actions",
    SUBSTATES: "substates",
    ACCOUNT: "accounts",
    FILES: "files",
    USERS: "users"
};

const allowedTags = Object.keys(tags).map((key) => {
    return tags[key]
})

export default tags;
export {
    allowedTags
};