module.exports = {
    servers: {
        one: {
            "host": "appname.com",
            "username": "root",
            opts: {
                port: 22,
            },
            // "pem": "/Users/theodor/.ssh/id_rsa",
            // pem:
            // password:
            // or leave blank for authenticate from ssh-agent
        }
    },

    meteor: {
        name: 'appname.com',
        path: '../../',
        servers: {
            one: {}
        },
        buildOptions: {
            serverOnly: true,
        },
        env: {
            ROOT_URL: 'https://appname.com',
            MONGO_URL: 'mongodb://localhost/meteor',
            PORT: 3000
        },

        dockerImage: 'artyomjackson/meteord-imagemagick:latest',
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