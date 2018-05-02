import Tags from '../collection';

export default Tags.createNamedQuery('listTags', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    name: 1,
    clientId: 1,
    _id: 1
});