export default class OptionsGenerator {
    static generateOptions(actions) {
        return _.map(actions, ({
            _id,
            title
        }) => {
            const value = title;
            return {
                value: _id,
                label: value
            };
        });
    }
    static selectAction(actionId, actions) {
        for (let action of actions) {
            if (action._id === actionId) {
                return action;
            }
        }
    }
}