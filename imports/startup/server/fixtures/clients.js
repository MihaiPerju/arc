import faker from 'faker';
import Clients from '/imports/api/clients/collection';

const createClient = ({clientName, firstName, lastName, email, contacts}) => {
    Clients.insert({
        clientName,
        firstName,
        lastName,
        email,
        contacts
    });
};

Meteor.startup(function () {
    if (Clients.find().count() > 0) {
        return true;
    }

    for (let i = 0; i < 10; i++) {
        createClient({
            clientName: `${faker.name.firstName()} ${faker.name.lastName()}`,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: `client-${i + 1}@app.com`,
            contacts: [{
                email: `contact_person-${i + 1}@app.com`,
                contactDescription: 'A nice person to contact',
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                phone: faker.phone.phoneNumber(),
                notes: 'Aditional notes go here'
            }]
        })
    }
    console.log('[ok] client fixtures have been loaded.');
});