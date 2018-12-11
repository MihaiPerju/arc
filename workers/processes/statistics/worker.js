const { ClientStatistics } = require('./ClientStatistics');
const { connectToMongo } = require('../../dbSetup');
const { BasicQueue } = require('../../BasicQueue');

// ! Testing only - prod version needs to be cleaned up
connectToMongo()
    .then(client => {
        if(!client)
            process.exit(0);

        const db = client.db('arcc');
        const verifyOnline = () => client.isConnected()

        function processClient(queue) {
            const nextItem = queue.getNext();
            console.log(nextItem);
        }

        const clientQueue = new BasicQueue({addCB: processClient});

        // Get the list of clients
        db.collection('clients').find({status: true}).forEach(item => {
            clientQueue.add(item);
        })

        // const CS = new ClientStatistics(db, verifyOnline,'t6FYCP4hNiMaD5Xnb')

        // CS.computeClientStats(new Date('11/01/2018'))
        //     .then(data => {
        //         console.log(data)
        //         CS.updateClientStats(data)
        //             .catch(err => console.error(err))
        //     })
        //     .catch(err => console.error(err))
    })