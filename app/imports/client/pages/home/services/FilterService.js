import moment from 'moment';

export default class FilterService {

  static getQuery(dateRange, startDate, endDate) {
    var query = {};
    var dateTimeNow = moment();
    var today = new Date(dateTimeNow);
    var yesterday = new Date(dateTimeNow.add(-1, 'days'));
    switch (dateRange) {
      case 'today':
        query = { $eq: today };
        return query;
      case 'yesterday':
        query = { $eq: yesterday };
        return query;
      case 'last_week':
        var lastWeekStartDate = new Date(moment().subtract(1, 'weeks').startOf('isoWeek'));
        var lastWeekEndDate = new Date(moment().subtract(1, 'weeks').endOf('isoWeek'));
        query = {
          $gte: lastWeekStartDate,
          $lt: lastWeekEndDate
        };
        return query;
      case 'last_month':
        var lastMonthStartDate = new Date(moment().subtract(1, 'months').startOf('month'));
        var lastMonthEndDate = new Date(moment().subtract(1, 'months').endOf('month'));
        query = {
          $gte: lastMonthStartDate,
          $lt: lastMonthEndDate
        };
        return query;
      case 'last_year':
        var lastYearStartDate = new Date(moment().subtract(1, 'years').startOf('year'));
        var lastYearEndDate = new Date(moment().subtract(1, 'years').endOf('year'));
        query = {
          $gte: lastYearStartDate,
          $lt: lastYearEndDate
        };
        return query;
      case 'week_to_date':
        var thisWeekStartDate = new Date(moment().subtract(0, 'weeks').startOf('isoWeek'));
        var thisWeekEndDate = today;
        query = {
          $gte: thisWeekStartDate,
          $lt: thisWeekEndDate
        };
        return query;
      case 'month_to_date':
        var thisMonthStartDate = new Date(moment().subtract(0, 'months').startOf('month'));
        var thisMonthEndDate = today;
        query = {
          $gte: thisMonthStartDate,
          $lt: thisMonthEndDate
        };
        return query;
      case 'year_to_date':
        var thisYearStartDate = new Date(moment().subtract(0, 'years').startOf('year'));
        var thisYearEndDate = today;
        query = {
          $gte: thisYearStartDate,
          $lt: thisYearEndDate
        };
        return query;
      case 'custom_range':
        query = {
          $gte: startDate,
          $lt: endDate
        };
        return query;
      default:
        query = null;
        return query;
    }
  }

}