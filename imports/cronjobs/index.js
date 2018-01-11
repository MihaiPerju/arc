import './cron';
import SftpTransport from './SftpTransport';
import FacilityFileScan from './server/FacilityFileScan';

const fileScan = new FacilityFileScan();
fileScan.run();
