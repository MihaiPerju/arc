import SftpClient from 'ssh2-sftp-client';
import moment from 'moment';


export default class SftpTransport {
    constructor(sftpConfig) {
        this.config = sftpConfig;
        this.client = new SftpClient();
    }

    async connect() {
        await this.client.connect(this.config);
        return this.client;
    }

    archiveFiles(path) {
        let filesList = [];

        this.client.list(path).then((files) => {
            files.forEach((file) => {

                //If it's different from archive file enter it
                if (this._isDirectory(file) && file.name !== 'archive') {
                    //enter it and continue work
                    this.archiveFiles(path + '/' + file.name);
                } else if (this._isCsvFile(file)) {
                    //it is a CSV file and we need to copy it

                }
            })
        });
    }

    _isCsvFile(file) {
        //Need to check extension. For this, we need to check Db and see attachment
        // files and compare extensions
        if (file.type === '-') {
            return true;
        }
        return false;
    }

    _isDirectory(file) {
        if (file.type === 'd') {
            return true;
        }
        return false;
    }
}