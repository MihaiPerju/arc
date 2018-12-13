const { ClientStatistics } = require('./ClientStatistics');
const { connectToMongo } = require('../../dbSetup');

// ! Testing only - prod version needs to be cleaned up
connectToMongo()
    .then(client => {
        if(!client)
            process.exit(0);

        const db = client.db('arcc');
        const verifyOnline = () => client.isConnected()

        // Get the list of clients
        db.collection('clients').find({status: true}).forEach(item => {
            const CS = new ClientStatistics(db, verifyOnline,item._id)

            CS.computeClientStats(new Date('11/01/2018'))
                .then(data => {
                    CS.updateClientStats(data)
                        .then(() => console.log(`Updated ${item.clientName}`))
                        .catch(err => console.error(err))
                })
                .catch(err => console.error(err))
        })
    })