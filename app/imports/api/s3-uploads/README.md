S3 Upload Module
==========================

Clone it into your packages folder. And modify it however you wish.

Here is what you need to do to get it up and running:

## Configure AWS S3

In settings json:
```json
  "private": {
    "AWS": {
      "key": "x",
      "secret": "x",
      "bucket": "x",
      "region": "x",
      "url": "http://x"
    }
  },
  "public": {
    "AWS": {
      "url": "http://x"
    }
  }
```
