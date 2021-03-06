const path = require('path');
const fs = require('fs');

const { Info, OAB, Processos } = require('../dist/index.js');

describe('info', () => {
  it('info.xml', () => {
    const processoStr = fs.readFileSync(path.join(__dirname, './info.xml'));
    const { response: info } = Info.openString(processoStr).load();
    Info.compatible(info, '0001318-78.2015.5.02.0012');
  });
});

describe('processos', () => {
  it('processos.xml', () => {
    const processoStr = fs.readFileSync(path.join(__dirname, './processo.xml'));
    const { response } = Processos.openString(processoStr).load();
  });
});

describe('OAB', () => {
  it('oab.xml', () => {
    const processoStr = fs.readFileSync(path.join(__dirname, './oab.xml'));
    const { response } = OAB.openString(processoStr).load();
  });
});
