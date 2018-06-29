import Facilities from "/imports/api/facilities/collection";
import SftpTransport from "../SftpTransport";
import sftpData from "/imports/api/business";
import SyntaxService from "./service";

export default class FacilityFilesService {
  run() {
    return Promise.await(this._run());
  }

  async _run() {
    const sftpConfig = Meteor.settings.private.sftp;
    const sftp = new SftpTransport(sftpConfig);
    await sftp.connect();

    //How to project only sftp-Field? Default method from docs not working
    const facilities = Facilities.find().fetch();

    //Extract paths from facilities
    for (let facility of facilities) {
      let { sftpPath } = facility;
      sftpPath = SyntaxService.correctPath(sftpPath);

      const facilityPath = sftpData.SFTP_ROOT_FOLDER + sftpPath;
      const filePath = facilityPath;

      // Check for new files. Get them. Process them
      const files = await sftp.getFiles(facilityPath);
      files.forEach(file => {
        const { name } = file;
        sftp.processFile(name, facility);
      });
      //Archieve them
      sftp.archiveFiles(filePath, facilityPath);
    }
  }
}
