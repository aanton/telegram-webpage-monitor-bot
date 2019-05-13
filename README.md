# @aanton/telegram-webpage-monitor-bot

Monitors a webpage detecting when a predefined block/snippet has changed & sends a message to a Telegram chat using a Telegram bot.

## Installation

```bash
npm install @aanton/telegram-webpage-monitor-bot
```

## Usage

```js
const path = require('path');
const cheerio = require('cheerio');
const monitorWebpage = require('@aanton/telegram-webpage-monitor-bot');

monitorWebpage({
  name: 'first-link-monitor',
  url: 'https://mydomain.com',
  storage: path.resolve(__dirname + '/.storage'),
  telegramBotToken: ...,
  telegramChatId: ...,
  telegramSendMessageOptions: {},
  extractSnippet: function(html) {
    const $ = cheerio.load(html);
    return $("a[href*='www.mydomain.com']").first().attr("href");
})
  .then(JSON.stringify)
  .then(console.log)
  .catch(console.log);
```

### Configuration parameters

* `name`: Unique name
* `url`: Webpage URL to monitor
* `url`: Local storage to store the block/snippet created from the webpage using the `extractSnippet` function
* `telegramBotToken`: Telegram bot token
  * Create a [Telegram bot](https://core.telegram.org/bots) using [BotFather](https://telegram.me/botfather)
* `telegramChatId`: Telegram chat identifier
  * It can be a private conversation with the bot (you must send previously a message to the bot), a group conversation (the bot must be a member) or a channel conversation (the bot must be an administrator member)
  * The chat identifier can be obtained using [@ChannelIdBot](https://t.me/ChannelIdBot)
* `telegramSendMessageOptions`: [Telegram message options](https://core.telegram.org/bots/api#sendmessage) to enable HTML/Markdown format, disable links preview, ...
* `extractSnippet`: Function that extracts the snippet from the webpage HTML