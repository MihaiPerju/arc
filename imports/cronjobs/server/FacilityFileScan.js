import Facilities from '/imports/api/facilities/collection';
import SftpTransport from '../SftpTransport';

export default class FacilityFilesService {
    run() {
        return Promise.await(this._run());
        // return true;
    }

    async _run() {
        const sftpConfig = Meteor.settings.private.sftp;
        const sftp = new SftpTransport(sftpConfig);
        await sftp.connect();

        //How to project only sftp-Field? Default method from docs not working
        const facilities = Facilities.find().fetch();

        //Extract paths from facilities
        for (facility of facilities) {

            const {sftpPath} = facility;
            const path = '/server' + sftpPath;
            // On every path check if there are new files and do the job
            sftp.archiveFiles(path);
        }
    }

}
