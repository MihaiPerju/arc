export default class FilterService {
  static formatDate(date) {
    return date ? new Date(date).toString() : null;
  }
}
