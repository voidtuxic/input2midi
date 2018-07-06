const ioHook = require('iohook');
const midi = require('midi');
const fs = require('fs');

const mapping = require('./mapping');

const output = new midi.output();
output.openVirtualPort('input2midi');

const config = JSON.parse(fs.readFileSync('./input.json', 'utf8'));

mapping.load(output, ioHook, config);

ioHook.start();

const exitHandler = (options, err) => {
  output.closePort();
  process.exit();
};

process.on('exit', exitHandler.bind(null, { cleanup: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
