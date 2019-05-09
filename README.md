# Telegram webpage monitor bot

Telegram bot that monitors a webpage, detects when a block has changed & sends it to a Telegram chat.

See a [Telegram bot that monitors a feed](https://github.com/aanton/telegram-feed-monitor-bot).

## Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Create the file `config.js` copying `config.example.js` and filling it properly

## Configuration

* Webpage URL to monitor
* Telegram bot token
  * Create a [Telegram bot](https://core.telegram.org/bots) using [BotFather](https://telegram.me/botfather)
* Telegram chat identifier
  * It can be a private conversation with the bot (you must send previously a message to the bot), a group conversation (the bot must be a member) or a channel conversation (the bot must be an administrator member)
  * The chat identifier can be obtained checking the bot updates
    * Send a message to the private/group/channel conversation
    * Check the bot updates in https://api.telegram.org/bot[BOT-TOKEN]/getUpdates & look for `chat.id` in the sent message
* Function used to extract the snippet from the webpage html
  * The function received a parameter, it is a function provided by [cheerio](https://cheerio.js.org/) that provides an API similar than jQuery
  * See examples below
* [Telegram message options](https://core.telegram.org/bots/api#sendmessage) to enable HTML/Markdown format, disable links preview, ...

## Usage

* Run `node index.js` manually to verify it is working properly
* Run it periodically using a crontab or a similar tool

## Examples of "extractSnippet" function

* The first link containing the string `/article/` inside the #content block

```js
"extractSnippet": function($) {
  return $("#content a[href*='/article/']").first().attr("href");
}
```

* A list of links included in a `nav#links`. Also configure Markdown format & disable links preview

```js
"telegramMessageOptions": {
  parse_mode: "Markdown",
  disable_web_page_preview: true
},
"extractSnippet": function($) {
  const $items = $('nav#links a');
  if ($items.length === 0) return "";

  const items = [];
  $items.each(function(index, element) {
    const $item = $(this);
    const title = $item.text().trim();
    const href = $item.attr('href');

    if (title && href) {
      items.push({
        title: title,
        href: href.replace(/\?utm_.+/, '')
      });
    }
  });

  const snippet = '*Items list*\n' + items.map(function(item) {
    return '- ' + item.title + ': ' + item.href;
  }).join('\n');
  return snippet;
}
```