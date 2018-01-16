import './cron';
import FacilityFileScan from "./server/FacilityFileScan";

//start cronometer
// SyncedCron.start();

const fileScan = new FacilityFileScan();
fileScan.run();
