export default class FilterService {
  static formatDates(date) {
    return date ? new Date(date).toString() : null;
  }
}
