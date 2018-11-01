Welcome to App!
====

## Start the app
---

```
npm start
```


## Credentials

There are 10 pre-loaded demo users: 1 admin, and 3 of each other role.  The username syntax is as follows: `<role>`-`<1-3>`@app.com.


### System Roles
  - Admin
  - Tech
  - Manager
  - Rep


### Demo Accounts
  - admin: admin@app.com
  - managers: manager-#@app.com
  - tech: tech-#@app.com
  - rep: rep-#@app.com

The # represents: `1`, `2`, or `3`.

Password (for all): `12345`



### Deployment setup

The problem with PhantomJS not being able to be installed.

```
npm set strict-ssl false
touch /root/.npmrc
echo "phantomjs_cdnurl=https://cnpmjs.org/downloads" > /root/.npmrc
```

### Understanding ARCC Fonts

Fonts were generated with [IcoMoon](https://icomoon.io/app/#/select).  To modify this, import arcc_font_set.svg into
the tool.
