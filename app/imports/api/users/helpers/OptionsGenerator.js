export default class OptionsGenerator {
    static getUserOptions(users) {
        let userOptions = users.map((user) => {
            return {
                label: this.getFullUserName(user),
                value: user._id
            };
        })
        return userOptions;
    }

    static getFullUserName(user) {
        if (user.profile) {
            const {
                profile
            } = user;
            return `${profile.firstName} ${profile.lastName}`;
        }
    }
}