import Letters from "/imports/api/letters/collection";
import Statuses from "/imports/api/letters/enums/statuses";

export default class LetterManagement {
  static run() {
    // updating all letters with status new & manually mailed false
    Letters.update(
      {
        status: Statuses.NEW,
        isManuallyMailed: false
      },
      {
        $set: {
          status: Statuses.PENDING
        }
      }
    );
  }
}
