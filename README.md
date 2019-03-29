# Glowify

Glowify is a service that enables gamification of GitKraken Glo Bords. You define a Listen and Publish board and each user event done in the Listen board will be processed by Glowify. After the event is processed Glowify will post the results to the Publish board in form of levels (columns), user points (cards) and achievements (labels).

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## About

This project wasn't created just for the [GitKraken Glo Boards API Contest](https://www.gitkraken.com/glo-api-contest) but in majoriti out of curiosity to learn a bit more about [express](https://github.com/expressjs/express), [react](https://github.com/facebook/react/) and [sequelize](https://github.com/sequelize/sequelize).

## Things that still need/can to be done

- Add [seeds and migration](http://docs.sequelizejs.com/manual/migrations.html) to sequelize
- Points editor: enable users to edit how many points is an event worth
- Security improvements (database and API)
- ~~Achievements with tags. By reaching certain amount of a specific event you can unlock an achievement (commentator, mover, ...)~~
- Additional actievements (for example count characters that users create by comments and descriptions or count emojis)
