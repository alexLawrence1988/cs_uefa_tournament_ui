import axios from 'axios';
const config = require('../config/config.js');
const jwt = require('jsonwebtoken');
const instance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 5000,
  headers: {
    'Accept-Version': 1,
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
    'x-access-token': signToken({user: 'clubSpark'}, config.api.secretKey)
  },
});

function signToken(payload, secret){
  let token = jwt.sign(payload, secret);
  return token;
}

export default instance;