'use strict';

const fs = require('fs');
const axios = require("axios");

async function monitorWebpage(config) {
  const name = config.name;
  const url = config.url;
  const storage = config.storage;
  const telegramBotToken = config.telegramBotToken;
  const telegramChatId = config.telegramChatId;
  const telegramSendMessageOptions = config.telegramSendMessageOptions;

  async function getWebPage() {
    const response = await axios.get(url);
    return response.data;
  }

  async function extractSnippet(html) {
    const snippet = config.extractSnippet(html);
    if (! snippet) {
      return Promise.reject('ERROR: Snippet ' + name + ' not found');
    }

    return snippet;
  }

  async function checkSnippetsHasChanged(snippet) {
    let previousSnippet = false;
    if (fs.existsSync(storage)) {
      previousSnippet = fs.readFileSync(storage, 'utf8');
    }

    if (previousSnippet && previousSnippet === snippet) {
      return Promise.reject('Snippet ' + name + ' has not changed');
    }

    fs.writeFileSync(storage, snippet, 'utf8');
    return snippet;
  }

  async function postMessage(snippet) {
    const url = 'https://api.telegram.org/bot' + telegramBotToken + '/sendMessage';
    let params = {
      chat_id: telegramChatId,
      text: snippet
    };
    Object.assign(params, telegramSendMessageOptions);

    const response = await axios.post(url, params);
    return response.data;
  }

  return getWebPage()
    .then(extractSnippet)
    .then(checkSnippetsHasChanged)
    .then(postMessage);
}

module.exports = monitorWebpage;