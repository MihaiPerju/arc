import Letters from "/imports/api/letters/collection";
import Statuses from "/imports/api/letters/enums/statuses.js";
import moment from "moment";

export default class LetterManagementService {
  static getLetterCsvData(results, content) {
    const accountNumberIndex = results[0].indexOf("Account Number");
    if (content == Statuses.SENT) {
      const firstScanDateIndex = results[0].indexOf("FirstScanDate");
      results.shift();
      results.map(letter => {
        if (letter[accountNumberIndex] && letter[firstScanDateIndex]) {
          this.updateFirstScanDate(
            letter[accountNumberIndex].trim(),
            letter[firstScanDateIndex]
          );
        }
      });
    } else if (content == Statuses.RECEIVED) {
      const inHomeDateIndex = results[0].indexOf("In Home Date");
      results.shift();
      results.map(letter => {
        if (letter[accountNumberIndex] && letter[inHomeDateIndex]) {
          this.updateInHomeDate(
            letter[accountNumberIndex].trim(),
            letter[inHomeDateIndex]
          );
        }
      });
    }
  }

  static convertToDate(value) {
    if (value) {
      const date = new Date(value);
      const dateString =
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "/" +
        ("0" + date.getDate()).slice(-2) +
        "/" +
        date.getFullYear();
      const parsed = moment(dateString, "MM/DD/YYYY", true);
      return parsed.isValid() ? parsed.toDate() : null;
    }
  }

  static updateFirstScanDate(letterId, firstScanDate) {
    firstScanDate = this.convertToDate(firstScanDate);
    Letters.update(
      {
        _id: letterId
      },
      {
        $set: {
          status: Statuses.SENT,
          firstScanDate
        }
      }
    );
  }

  static updateInHomeDate(letterId, inHomeDate) {
    inHomeDate = this.convertToDate(inHomeDate);
    Letters.update(
      {
        _id: letterId
      },
      {
        $set: {
          status: Statuses.RECEIVED,
          inHomeDate
        }
      }
    );
  }
}
