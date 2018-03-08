import Tags from '../collection';

export default Tags.createNamedQuery('listTags', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    privacy: 1,
    name: 1,
    userId: 1
});