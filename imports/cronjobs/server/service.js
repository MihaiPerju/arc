export default class SyntaxService {
    static correctPath(path) {
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        return path;
    }
}