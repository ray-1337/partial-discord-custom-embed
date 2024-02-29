# partial-discord-custom-embed
Create a custom Discord embed through a layered URL parameters. This is a fork of my [YouTube Discord Embed](https://github.com/ray-1337/youtube-discord-embed).

## Motivation
There is currently no support on applying a video in embed through a bot client. So, using a third party like this helps that.

## Disclaimer
This has limited features, such as you cannot apply a footer text, thumbnail, etc.

## Nice, can I use this?
Absolutely, you can fork the repo, host it somewhere else, and change the domain.

## API
Currently, only supports `title`, `description`, `imageURL`, `videoURL`, `embedColor`, and `authorText`.

The usage is quite simple, just append the parameters to the URL with keys provided above.

> https://ce.cdn.13373333.one/?title=uwu&description=owo

## License
[MIT](LICENSE)