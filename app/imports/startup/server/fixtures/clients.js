import faker from 'faker';
import Clients from '/imports/api/clients/collection';
import Counter from './config';
import ContactTypes from '/imports/api/facilities/enums/contactTypes';

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

    for (let i = 0; i < Counter.CLIENTS; i++) {
        createClient({
            clientName: `${faker.name.firstName()} ${faker.name.lastName()}`,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: `client-${i + 1}@app.com`,
            createdAt: new Date(),
            contacts: [{
                email: `contact_person-${i + 1}@app.com`,
                contactType: ContactTypes.TECHNICAL,
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                phone: faker.phone.phoneNumber(),
                notes: 'Aditional notes go here'
            }]
        })
    }

});