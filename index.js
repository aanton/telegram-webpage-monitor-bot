'use strict';

const fs = require('fs');
const path = require('path');
require('log-timestamp');
const cheerio = require('cheerio');
const axios = require("axios");
const config = require('./config.js');

async function getWebPage() {
  const response = await axios.get(config.webpage);
  return response.data;
}

async function extractSnippet(html) {
  const $ = cheerio.load(html);
  const snippet = config.extractSnippet($);
  if (! snippet) {
    return Promise.reject('ERROR: Snippet not found');
  }

  return snippet;
}

async function checkSnippetsHasChanged(snippet) {
  const storage = path.resolve(__dirname + '/.storage');

  let previousSnippet = false;
  if (fs.existsSync(storage)) {
    previousSnippet = fs.readFileSync(storage, 'utf8');
  }

  if (previousSnippet && previousSnippet === snippet) {
    return Promise.reject('Snippet has not changed');
  }

  fs.writeFileSync(storage, snippet, 'utf8');
  return snippet;
}

async function postMessage(snippet) {
  const url = 'https://api.telegram.org/bot' + config.telegramBotToken + '/sendMessage';
  const response = await axios.post(url, {
    chat_id: config.telegramChatId,
    text: snippet
  });

  return response.data;
}

getWebPage()
  .then(extractSnippet)
  .then(checkSnippetsHasChanged)
  .then(postMessage)
  .then(console.log)
  .catch(console.log);