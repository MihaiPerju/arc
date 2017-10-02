import Users from '../collection'; // for indexing and others

Users.deny({
    update() { return true}
});