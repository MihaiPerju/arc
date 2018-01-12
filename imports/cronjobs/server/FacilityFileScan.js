import Facilities from '/imports/api/facilities/collection';
import SftpTransport from '../SftpTransport';
import sftpData from '/imports/api/business';
import SyntaxService from './service';

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
        for (facility of facilities) {

            let {sftpPath} = facility;
            sftpPath = SyntaxService.correctPath(sftpPath);

            const facilityPath = sftpData.SFTP_ROOT_FOLDER + sftpPath;
            const filePath = facilityPath;

            // On every path check if there are new files and do the job
            sftp.archiveFiles(filePath, facilityPath);

            //Process archived files as inventory files
            // sftp.processFiles(facility, sftp.files);
        }
    }
}
