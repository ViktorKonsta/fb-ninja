# fb-ninja
Makes batch requests to facebook API an easy task for you

> This is a draft! Offers are welcome!

## Features

> Will be later

## Install

```
npm install --save fb-ninja
```

## Usage

Simple way

```js
const ninja = require("fb-ninja")

// define what you need for every request
const req1 = {
  method: "get",
  api: "me/accounts"
}

// top level access token
const options = { accessToken: process.env.ACCESS_TOKEN }

// get all result in one place as well as result per request
// place as many requests as you want
ninja([req1], options)
  .then(detailedResult => console.log(detailedResult))
  .catch(err => console.error(err))
```

## Reuqest options

> Will be later