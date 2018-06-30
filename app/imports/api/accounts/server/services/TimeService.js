export default class TimeService {
    static sameYear(date1, date2) {
        return date1.year() === date2.year();
    }

    static sameMonth(date1, date2) {
        //To be the same month, it must have same month index of the year and have same year
        return date1.month() === date2.month() && this.sameYear(date1, date2);
    }

    static sameWeek(date1, date2) {
        //To be the same week day, it must have same the same week of year index and same year
        return (date1.isoWeek() === date2.isoWeek() && this.sameYear(date1, date2))
    }
}