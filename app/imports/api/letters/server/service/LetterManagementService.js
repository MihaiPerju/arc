import Letters from "/imports/api/letters/collection";
import Statuses from "/imports/api/letters/enums/statuses.js";
import moment from "moment";

export default class LetterManagementService {
  static getLetterCsvData(results, content) {
    const accountNumberIndex = results[0].indexOf("Account Number");
    if (content == "sent") {
      const firstScanDateIndex = results[0].indexOf("FirstScanDate");
      results.shift();
      results.map(letter => {
        if (letter[accountNumberIndex] && letter[firstScanDateIndex]) {
          this.processFile(
            letter[accountNumberIndex].trim(),
            letter[firstScanDateIndex]
          );
        }
      });
    } else if (content == "receive") {
      const inHomeDateIndex = results[0].indexOf("In Home Date");
      results.shift();
      results.map(letter => {
        if (letter[accountNumberIndex] && letter[inHomeDateIndex]) {
        this.homeFile(letter[accountNumberIndex].trim(), letter[inHomeDateIndex]);
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
  static processFile(letterId, firstScanDate) {
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

  static homeFile(letterId, inHomeDate) {
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
