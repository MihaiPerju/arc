import Files from '../collection';

export default Files.createNamedQuery('listFiles', {
    $filter({filters, options, params}) {
        console.log(params);
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    fileName: 1
});