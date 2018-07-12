module.exports = {
    servers: {
        one: {
            "host": "45.55.0.237",
            "username": "root",
            opts: {
                port: 22,
            },
            password: '44adc8cd512add8dd64b6ec2971'
            // "pem": "/Users/theodor/.ssh/id_rsa",
            // pem:
            // password:
            // or leave blank for authenticate from ssh-agent
        }
    },

    meteor: {
        name: 'arcc',
        path: '../../',
        servers: {
            one: {}
        },
        buildOptions: {
            serverOnly: true,
        },
        env: {
            ROOT_URL: 'http://45.55.0.237:3000',
            MONGO_URL: 'mongodb://localhost/arcc',
            PORT: 3000
        },

        dockerImage: 'abernix/meteord:node-8.11.2-base',
        deployCheckWaitTime: 60,
        enableUploadProgressBar: true
    },

    mongo: {
        oplog: true,
        port: 27017,
        servers: {
            one: {},
        },
    },
};