const telegraf = require('telegraf');
const axios = require('axios');
const bot = new telegraf('797780918:AAFAlkA02zoGnMGSw9ToG8ISVp7TyzPgvlw');
const fs = require('fs');

bot.command('fortune', (ctx) => {
   axios
      .get('https://yerkee.com/api/fortune')
      .then((res) => {
         ctx.reply(res.data.fortune);
      })
      .catch((err) => {
         console.log(err);
      });
});
bot.command('cat', async (ctx) => {
   let input = ctx.message.text;
   let inputArray = input.split(' ');

   if (inputArray.length == 1) {
      let res = await axios.get('https://aws.random.cat/meow');
      ctx.replyWithPhoto(res.data.file);
   } else {
      inputArray.shift();
      input = inputArray.join(' ');
      ctx.replyWithPhoto(`https://cataas.com/cat/says/${input}`);
   }
});

bot.command('dogbreeds', (ctx) => {
   let data = fs.readFileSync('./dog.json', 'utf-8');
   let datadog = JSON.parse(data);
   var message = 'Dog Breeds:\n';
   datadog.forEach((item) => {
      message += `-${item}\n`;
   });
   ctx.reply(message);
});

bot.launch();
