const path = require('path');
const fs = require('fs');
const JuristekParser = require('../lib/index.js');

describe('read processos', () => {
  it('parse processo.xml', () => {
    const processoStr = fs.readFileSync(path.join(__dirname, './processo.xml'));
    const processos = JuristekParser.Processos.openString(processoStr, JuristekParser.Processos);
    console.log(processos.dump().processos[0].dadosCaptura);
  });
});
