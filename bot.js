const telegraf = require('telegraf');
const axios = require('axios');
const bot = new telegraf('797780918:AAFAlkA02zoGnMGSw9ToG8ISVp7TyzPgvlw');

bot.command('start', (ctx) => {
   axios
      .get('http://yerkee.com/api/fortune')
      .then((res) => {
         ctx.reply(res.data.fortune);
      })
      .catch((err) => {
         console.log(err);
      });
});

bot.launch();
