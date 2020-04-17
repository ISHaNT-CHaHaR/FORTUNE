const telegraf = require('telegraf');
const axios = require('axios');
const bot = new telegraf('797780918:AAFAlkA02zoGnMGSw9ToG8ISVp7TyzPgvlw');
const fs = require('fs');

const helpmessage = `*Fortune Bot* 
/fortune -gives some suggestions
/dog \`breed\` -pic with any breed
/cat -pic of a cat
/cat \`text\` -pic with any word
/dogbreeds -list of dog breeds`;

bot.help((ctx) => {
   bot.telegram.sendMessage(ctx.from.id, helpmessage, {
      parse_mode: 'markdown',
   });
   // ctx.reply(helpmessage);
});

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

   let message = 'Dog Breeds:\n';

   datadog.forEach((item) => {
      message += `-${item}\n`;
   });
   ctx.reply(message);
});

bot.command('dog', (ctx) => {
   let input = ctx.message.text.split(' ');

   if (input.length != 2) {
      ctx.reply('You must a dog breed as the second argument!');
      return;
   }

   let breed = input[1];
   let data = fs.readFileSync('./dog.json', 'utf-8');
   let datadog = JSON.parse(data);

   if (datadog.includes(breed)) {
      axios
         .get(`https://dog.ceo/api/breed/${breed}/images/random`)
         .then((res) => {
            ctx.replyWithPhoto(res.data.message);
         })
         .catch((e) => {
            console.log(e);
         });
   } else {
      let suggestions = datadog.filter((item) => {
         return item.startsWith(breed);
      });
      ctx.reply(suggestions);
      let message = 'DID U MEAN:\n';
      suggestions.forEach((item) => {
         message += `-${item}\n`;
      });
      if (suggestions.length == 0) {
         ctx.reply('Cannot find breed');
      } else {
         ctx.reply(message);
      }
   }
});

bot.launch();
