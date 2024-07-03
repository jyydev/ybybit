# About

[bybitapi](https://www.npmjs.com/package/bybitapi) is a non-official, simple Node.js & JavaScript SDK for Bybit REST API.

## Usage example 1 (api class)

```
const api = require('bybitapi')
let acc = new api(<apiKey>, <secret>);

async function test(){
  let r = await acc.get('/v5/account/wallet-balance', {accountType:'UNIFIED'})
  console.log(r) // {list[{totalEquity:.., ..}]}
}
test()
```

## Usage example 2 (call function)

```
const {call} = require('bybitapi')
let apiKey = <apiKey>;
let secret = <secret>;

async function test(){
  let data = {accountType:'UNIFIED'}
  let r = await call('/v5/account/wallet-balance', {data, apiKey, secret})
  console.log(r) // {list[{totalEquity:.., ..}]}
}
test()
```

## Installation

```

npm i bybitapi

```

## Parameters (call function)

function call(path, {data, apiKey, secret, method} )

- path = eg: "/v5/account/wallet-balance" [ref](https://bybit-exchange.github.io/docs/api-explorer/v5/account/wallet)
- apiKey = Bybit apiKey
- secret = Bybit api secret
- optional
  - data = params to be passed in, can be object (accountType:'UNIFIED') or query string (accountType=UNIFIED&key=value)
  - method = "GET" (default) OR "POST"

## Parameters (api function)

```

api.get(path, data)
api.post(path, data)

```

- data (optional) = refer above

### return

return object (result from Bybit api)
