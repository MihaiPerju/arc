import config from '../config';
import AWS from 'aws-sdk';

if (config.AWS) {
    AWS.config.update({
        accessKeyId: config.AWS.key,
        secretAccessKey: config.AWS.secret,
        region: config.AWS.region
    });
}

export default AWS;