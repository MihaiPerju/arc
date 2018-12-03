/**
* Generates options for React-Select
* @param {Array} options The array of options
* @param {String} valueKey The object key for value
* @param {String} labelKey The object key for the label
*/
export const generateOptions = function(options, valueKey, labelKey) {
    return options.map(option => {
        return {
            value: option[valueKey],
            label: option[labelKey]
        };
    });
};