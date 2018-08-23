import Files from "/imports/api/files/collection";

export default class FileService {
  static updateFileStatus(_id, status) {
    Files.update(
      { _id },
      {
        $set: { status }
      }
    );
  }
}
