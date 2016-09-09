# fb-ninja
Makes batch requests to facebook API an easy task for you

## Features

- Can handle a lot of API calls by split and defer them
- Accept callbacks `before`, `after`, `afterEach`, `beforeEach`
- Lightweight and fast

## Install

```
npm install --save fb-ninja
```

## Get started

```js
const ninja = require("fb-ninja")

// define what you need for every request
const request = {
  method: "get",
  api: "me/accounts"
}

// top level access token
const options = { accessToken: process.env.ACCESS_TOKEN }

// get all result in one place as well as result per request
// place as many requests as you want
ninja(request, options)
  .then(detailedResult => console.log(detailedResult))
  .catch(err => console.error(err))
```

## Arguments

### Request

It's the first parameter. All of them reffers to the api call itself.  
**Message or link are required. It's part of facebook field itself.**

| Required | Key | Descripiton | Type | Default
| :--- | :--- | :--- | :--- | :---
| yes | `accessToken` | Low level access token | `String` |
| yes | `message` | `Message` or `link` are required | `String` |
| no | `link` | `Message` or `link` are required | `String` |
| no | `method` | Low level method | `String` | `GET`

### Options

it's the second parameter

| Required | Key | Descripiton | Type | Default
| :--- | :--- | :--- | :--- | :---
| yes | `accessToken` | Top level access token | `String` | `""`
| no | `method` | Top level method (`POST` in batch requests always) | `String` | `POST`
| no | `api` | Top level api (`""` in batch requests always) | `String` | `""`
| no | `includeHeaders` | include headers in response or not | `Boolean` | `false`
| no | `appId` | Top level facebook application ID | | `null`
| no | `timeout` | Amount of time between batch requests | `ms` | `60000`
| no | `before` | Before first loop | `Function` | `null`
| no | `after` | After last loop | `Function` | `null`
| no | `beforeEach` | Before each loop | `Function` | `null`
| no | `afterEach` | After each loop | `Function` | `null`
| no | `retry` | Retry canceled requests? | `Boolean` | `true`

## Tests

First of all make sure you have installed dev dependencies:

```
npm install
```

To run tests you should make file at the root folder `facebook.json` and put there expected 
expected by you information that you can get from`Facebook Graph API Explorer`.

```json
{
  "me": {  
    "name": "[FACEBOOK_NAME]",
    "id": "[FACEBOOK_ID]",
    "accessToken": "[FACEBOOK_ACCESS_TOKEN]"
  },
  "page": {
    "accessToken": "[PAGE_FACEBOOK_ACCESS_TOKEN]"
  }
}
```

Then run

```
npm test
```