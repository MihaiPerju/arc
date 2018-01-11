import SftpClient from 'ssh2-sftp-client';

export default class SftpTransport {
    constructor(sftpConfig) {
        this.config = sftpConfig;
        this.client = new SftpClient();
    }

    async connect() {
        await this.client.connect(this.config);
        return this.client;
    }

    archiveFiles(filePath, facilityPath) {
        const copyPath = facilityPath + '/archive' + filePath.replace(facilityPath, "");

        Promise.await(this.client.list(filePath).then((files) => {
            files.forEach((file) => {

                //If it's different from archive file enter it
                if (this._isDirectory(file) && file.name !== 'archive') {

                    Promise.await(this.client.mkdir(copyPath + '/' + file.name, true));

                    //copy files
                    this.archiveFiles(filePath + '/' + file.name, facilityPath);

                    //remove folder
                    Promise.await(this.client.rmdir(filePath + '/' + file.name));

                } else if (this._isCsvFile(file)) {
                    //it is a CSV file and we need to copy it
                    const csvFilePath = filePath + '/' + file.name;
                    const stream = Promise.await(this.client.get(csvFilePath));
                    Promise.await(this.client.put(stream, copyPath + '/' + file.name));

                    //remove file
                    Promise.await(this.client.delete(filePath + '/' + file.name))
                }
            })
        }));
    }

    _isCsvFile(file) {
        //Need to check extension. For this, we need to check Db and see attachment
        // files and compare extensions
        return file.type === '-';
    }

    _isDirectory(file) {
       return file.type === 'd';
    }
}