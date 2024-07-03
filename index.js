const crypto = require("crypto");
const axios = require("axios");

function getSign(data, secret, apiKey, recvWindow, timestamp) {
  return crypto
    .createHmac("sha256", secret)
    .update(timestamp + apiKey + recvWindow + data)
    .digest("hex");
}

async function call(path, op = {}) {
  let apiKey = (op.apiKey ||= "");
  let secret = (op.secret ||= "");
  let method = (op.method ||= "GET");
  let data = (op.data ||= "");
  data = new URLSearchParams(data).toString();
  let recvWindow = (op.recvWindow ??= 5000);
  let timestamp = Date.now().toString();
  let sign = getSign(data, secret, apiKey, recvWindow, timestamp);
  const origin = "https://api.bybit.com";
  let url;

  if (method === "POST") {
    url = origin + path;
  } else {
    url = origin + path + "?" + data;
    data = "";
  }

  var headers = {
    "X-BAPI-SIGN-TYPE": "2",
    "X-BAPI-SIGN": sign,
    "X-BAPI-API-KEY": apiKey,
    "X-BAPI-TIMESTAMP": timestamp,
    "X-BAPI-RECV-WINDOW": recvWindow.toString(),
  };

  if (method === "POST") {
    headers["Content-Type"] = "application/json; charset=utf-8";
  }

  var config = {
    method,
    url,
    headers,
    data,
  };

  let r = await axios(config)
    .then((r) => {
      let rs = r.data.result;
      global["x-bapi-limit"] = r.headers["x-bapi-limit"];
      global["x-bapi-limit-status"] = Math.max(
        r.headers["x-bapi-limit-status"],
        global["x-bapi-limit-status"] || 0
      );
      return rs;
    })
    .catch(function (e) {
      console.log(e.response.data);
    });

  return r;
}

class api {
  constructor(apiKey = "", secret = "") {
    this.apiKey = apiKey;
    this.secret = secret;
  }
  async get(path, pr = {}) {
    let data = { apiKey: this.apiKey, secret: this.secret, data: pr };
    return call(path, data);
  }
  async post(path, pr = {}) {
    let data = { apiKey: this.apiKey, secret: this.secret, method: "POST", data: pr };
    return call(path, data);
  }
}

module.exports = api;
module.exports.call = call;
