const { translate } = require('bing-translate-api');

translate('This is a test', null, 'nl').then(res => {
  console.log(res.translation);
}).catch(err => {
  console.error(err);
});

// node ./src/scripts/translate.cjs