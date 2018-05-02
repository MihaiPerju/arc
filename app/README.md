Welcome to App!
====

## Start the app
---

```
meteor npm install
npm start
```


## Fixtures

```
admin@app.com : 12345
user-1@app.com : 12345
user-X@app.com : 12345 (Where X is a number from 1 to 5)
```

## Deploy

```
npm run deploy:qa
```

### Deployment setup

The problem with PhantomJS not being able to be installed.

```
npm set strict-ssl false
touch /root/.npmrc
echo "phantomjs_cdnurl=https://cnpmjs.org/downloads" > /root/.npmrc
```