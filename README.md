# [Nuzlocke Generator](https://nuzlocke-generator.herokuapp.com/) · ![Travis](https://img.shields.io/travis/EmmaRamirez/nuzlocke-generator.svg?style=flat-square)  ![Coveralls github](https://img.shields.io/coveralls/github/EmmaRamirez/nuzlocke-generator.svg?style=flat-square) ![Codacy grade](https://img.shields.io/codacy/grade/a41d81bbd4ad4479a0c71a1739707bf4.svg?style=flat-square) ![GitHub release](https://img.shields.io/github/release/EmmaRamirez/nuzlocke-generator.svg?style=flat-square)

> https://nuzlocke-generator.herokuapp.com/

This is a beta. Expect everything to break. Save backups if you value them.

# Running Locally

In order to run this application locally, you'll need [NodeJS](https://nodejs.org/en/) and [Git](https://git-scm.com/). After installing those, start by opening the command prompt and running the following commands:

```bash
git clone git@github.com:EmmaRamirez/nuzlocke-generator.git
cd nuzlocke-generator
npm install
npm run serve
```

Note: closing the command prompt will stop the server!

You can also click the `Clone or Download` button and select to download it as a zip file. You'll then want to use the `cd` command to navigate to the nuzlocke-generator folder. I'm available on Discord (emma#4085) or through Github issues if you have any questions.

You should find it at `localhost:8080`. In order to check for updates, run the following

```bash
git pull origin master
```

And then re-run the server!

## Why is the Generator down?

Not sure. Still investigating. Blame Heroku, I hadn't deployed a single thing and yet somehow the app blew up.

## A Preview

![alt](./src/assets/media-one.png)

![alt](./src/assets/media-two.png)

## Features
- Record your nuzlocke with a flashy image
- Save data on each of your Pokémon as a `json` file
- Flexible style editing for multiple scenarios

If you have ideas for features of fixes, please tell me! I want to make this app as useful as possible.

## Roadmap
- Supporting custom games, badges, types, moves, etc
- Space for sharing your custom ruleset
- Importing from this format and potentially save files
- Supporting better theming & customization of styles
- Fixing one million bugs

## Hall of Fame

None yet.

## Legal

I don't own Pokemon or any of the images except those of the app itself. All rights belong to their respective parties, including The Pokemon Company International and Nintendo. This application itself independent of copyrighted content is licensed under MIT.