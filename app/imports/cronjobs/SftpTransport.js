import SftpClient from 'ssh2-sftp-client';
import sftpData from '/imports/api/business';
import Papa from 'papaparse';
import AccountService from "../api/facilities/server/services/AccountImportingService";
import toString from 'stream-to-string';

export default class SftpTransport {
    constructor(sftpConfig) {
        this.config = sftpConfig;
        this.client = new SftpClient();
    }

    async connect() {
        await this.client.connect(this.config);
        return this.client;
    }

    getFiles(path, /*Function?*/callback) {
        if (!callback) {
            return new Promise((resolve, reject) => {
                this.getFiles(path, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        }

        let filesList = [];

        this.client.list(path).then((files) => {
            let pending = files.length;
            if (!pending) {
                //  done
                return callback(null, filesList);
            }

            files.forEach((file) => {
                if (file.name === 'archive') {
                    return;
                }
                let filePath = `${path}/${file.name}`;
                const fileObj = {
                    name: filePath,
                };

                if (file.type === 'd') {
                    this.getFiles(filePath, function (err, res) {
                        if (err) {
                            pending -= 1;
                            filesList.push({err, ...fileObj});
                            if (!pending) {
                                return callback(null, filesList);
                            }
                            return;
                            // return callback(err);
                        }

                        filesList = filesList.concat(res);
                        pending -= 1;
                        if (!pending) {
                            return callback(null, filesList);
                        }
                    });
                } else {
                    filesList.push(fileObj);
                    pending -= 1;
                    if (!pending) {
                        return callback(null, filesList);
                    }
                }
            });
        }).catch(function (err) {
            // console.log('catch err', err)
            filesList.push({err, path});
            callback(null, filesList)
        });
    }

    archiveFiles(filePath, facilityPath) {
        const copyPath = facilityPath + sftpData.SFTP_ARCHIVE_FOLDER + filePath.replace(facilityPath, "");
        Promise.await(this.client.list(filePath).then((files) => {
            files.forEach((file) => {
                //If it's different from archive file enter it
                if (this._isDirectory(file) && file.name !== 'archive') {
                    Promise.await(this.client.mkdir(copyPath + '/' + file.name, true));
                    //copy files
                    this.archiveFiles(filePath + '/' + file.name, facilityPath);
                    //remove folder
                    Promise.await(this.client.rmdir(filePath + '/' + file.name));
                }
                else if (this._isCsvFile(file)) {
                    //it is a CSV file and we need to copy it
                    const csvFilePath = filePath + '/' + file.name;
                    const stream = Promise.await(this.client.get(csvFilePath));
                    //Making directory
                    Promise.await(this.client.mkdir(copyPath, true));
                    //Copying files
                    Promise.await(this.client.put(stream, copyPath + '/' + file.name));
                    //Remove file
                    Promise.await(this.client.delete(filePath + '/' + file.name))
                }
            });
        }));
    }

    processFile(filePath, facility) {
        const stream = Promise.await(this.client.get(filePath));
        const {importRules} = facility;

        const parser = Meteor.wrapAsync(toString);
        const csvString = parser(stream);
        Papa.parse(csvString, {
                chunk: (results) => {
                    AccountService.upload(results.data, importRules, facility._id);
                }
            }
        );
    }

    _isCsvFile(file) {
        //If there is another format except '.csv' it will crack
        return file.type === '-';
    }

    _isDirectory(file) {
        return file.type === 'd';
    }
}