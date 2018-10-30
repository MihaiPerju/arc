# ARCC

## Installing dependencies

In order to run the project, you need to have Node, Meteor, and PyPdf installed. 

- Install Meteor here: https://www.meteor.com/install
- Install Node here: https://nodejs.org/
- Install PyPDF here: https://pypi.org/project/pyPdf/


ARCC contains 2 applications - the app and the worker, which is a microservice. 
These are the steps to install the packages and run the project:

1. `cd` to /app and run `npm install` or `yarn`
2. Inside the /app directory run `npm start`
3. In another terminal `cd` to /worker and run `npm install` or `yarn`
4. Inside the /worker dir run `npm start`


## Credentials

We have 4 roles in the system: ADMIN, TECH, MANAGER, REP

These are the credentials for each one:

- admin  - admin@app.com
- manager - manager-x@app.com, where x in {1,2,3}
- tech - tech-x@app.com, where x in {1,2,3}
- rep - rep-x@app.com, where x in {1,2,3}

The password is 12345 for all accounts.


## Documents

Official documentation - https://docs.google.com/document/d/1d6iB3vKQXrOSnXWmGpik0F31zmIpJrZgyLOEMsKaU_s/edit?ts=5b7c3d6d
