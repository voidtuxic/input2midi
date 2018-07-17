const path = require('path');
const express = require('express');

const create = (config, playlist) => {
  const flatConf = {};
  Object.keys(config).forEach(key => {
    const bindings = config[key];
    const flatBindings = [];
    Object.keys(bindings).forEach(bindingKey => {
      const binding = bindings[bindingKey];
      const flatBinding = Object.keys(binding).map(field => ({
        field,
        value: binding[field],
      }));
      flatBinding.splice(0, 0, { field: 'key', value: bindingKey });
      flatBindings.push(flatBinding);
    });
    flatConf[key] = flatBindings;
  });
  const app = express();
  app.use('/audio', express.static('audio'));
  app.use('/webfonts', express.static('webfonts'));
  app.set('views', path.resolve(__dirname, './views'));
  app.set('view engine', 'pug');
  app.get('/', function(req, res) {
    res.render('index', { config: flatConf, playlist });
  });
  app.listen(4242, () => {
    console.log('UI available on http://localhost:4242');
  });
};

module.exports = { create };
