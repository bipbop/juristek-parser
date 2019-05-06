const path = require('path');
const fs = require('fs');
const JuristekParser = require('../lib/index.js');

describe('read processos', () => {
  it('parse processo.xml', () => {
    const processoStr = fs.readFileSync(path.join(__dirname, './info.xml'));
    const info = JuristekParser.Parser.openString(processoStr, JuristekParser.Info).dump();
    console.log(JuristekParser.Info.compatible(info, '0001318-78.2015.5.02.0012'));
  });
});
