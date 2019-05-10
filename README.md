# Telegram webpage monitor bot

Telegram bot that monitors a webpage, detects when a block has changed & sends it to a Telegram chat.

See a [Telegram bot that monitors a feed](https://github.com/aanton/telegram-feed-monitor-bot).

## Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Create the file `config.js` copying `config.example.js` and filling it properly

## Configuration parameters

* `webpage`: Webpage URL to monitor
* `telegramBotToken`: Telegram bot token
  * Create a [Telegram bot](https://core.telegram.org/bots) using [BotFather](https://telegram.me/botfather)
* `telegramChatId`: Telegram chat identifier
  * It can be a private conversation with the bot (you must send previously a message to the bot), a group conversation (the bot must be a member) or a channel conversation (the bot must be an administrator member)
  * The chat identifier can be obtained using [@ChannelIdBot](https://t.me/ChannelIdBot)
* `telegramMessageOptions`: [Telegram message options](https://core.telegram.org/bots/api#sendmessage) to enable HTML/Markdown format, disable links preview, ...
* `extractSnippet`: Function that extracts the snippet from the webpage HTML
  * The function received a parameter: a function that provides an API similar than jQuery. See [cheerio](https://cheerio.js.org/)

```js
// config.js
const config = {
  webpage: '',
  telegramBotToken: '',
  telegramChatId: '',
  telegramMessageOptions: {},
  extractSnippet: function($) { return ''; }
}

module.exports = config;
```

### Example: Snippet created getting a link

* Gets the first link containing `/article/` that is inside the `#content` block
* The link will be previewed in Telegram (the default behaviour when sending a message with a link)

```js
// config.js
const config = {
  webpage: ...,
  telegramBotToken: ...,
  telegramChatId: ...,
  telegramMessageOptions: {},
  extractSnippet: function($) {
    return $("#content a[href*='/article/']").first().attr("href");
  }
}

module.exports = config;
```

### Example: Snippet created getting a list of links

* Get all links inside the `nav#links` blocks
* The message is sent in Markdown format & links preview is disabled

```js
// config.js
const config = {
  webpage: ...,
  telegramBotToken: ...,
  telegramChatId: ...,
  telegramMessageOptions: {
    parse_mode: 'Markdown',
    disable_web_page_preview: true
  },
  extractSnippet: function($) {
    const $items = $('nav#links a');
    if ($items.length === 0) return '';

    const items = [];
    $items.each(function(index, element) {
      const $item = $(this);
      const title = $item.text().trim();
      const href = $item.attr('href');

      if (title && href) {
        items.push({
          title: title,
          href: href
        });
      }
    });

    const snippet = '*Links list*\n' + items.map(function(item) {
      return '- [' + item.title + '](' + item.href + ')';
    }).join('\n');
    return snippet;
  }
}

module.exports = config;
```

## Usage

* Run `node index.js` manually to verify it is working properly
* Run it periodically using a crontab or a similar tool