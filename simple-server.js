const express = require('express');
const Logger = require('basic-logger');
const _ = require('lodash');
const bodyParser = require('body-parser');
const JuristekParser = require('./index.js');
const TinyDB = require('tinydb');
const path = require('path');

Logger.setLevel('info');
const log = new Logger();

const app = express();

app.use(bodyParser.raw({ type: () => true }));

const databaseProcesso = new TinyDB(path.join(__dirname, 'db', './processos.db'));

app.post('/processo', (req, res) => {
  const processo = JuristekParser.openString(req.body.toString(), JuristekParser).load();
  Object.assign(processo, { _bipbop: _.pickBy(req.headers, (v, k) => k.substr(0, 9) === 'x-bipbop-') });
  log.info(`Processo carregado: ${JSON.stringify(processo._bipbop)}`);
  databaseProcesso.insertItem(processo);
  databaseProcesso.flush(() => res.send(processo));
});

const port = process.env.PORT || 5000;

app.listen(port, () => log.info(`Listening on ${port}`));
