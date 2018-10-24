export default class OptionsGenerator {
    static generateOptions(reasonCodes) {
        return _.map(reasonCodes, ({
            _id,
            reason
        }) => {
            return {
                value: _id,
                label: reason
            };
        });
    }
}