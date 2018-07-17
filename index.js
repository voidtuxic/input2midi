require('module-alias/register');
const ioHook = require('iohook');
const midi = require('midi');
const inquirer = require('inquirer');
const fs = require('fs');
const OS = require('os');

const mapping = require('./mapping');
const server = require('@server/app');

const output = new midi.output();

const main = () => {
  // midi setup
  const config = JSON.parse(fs.readFileSync('./input.json', 'utf8'));
  mapping.load(output, ioHook, config);
  ioHook.start();

  // server setup
  server.create(config);

  // crash and exit handling
  const exitHandler = (options, err) => {
    output.closePort();
    process.exit();
  };

  process.on('exit', exitHandler.bind(null, { cleanup: true }));
  process.on('SIGINT', exitHandler.bind(null, { exit: true }));
  process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
  process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
  process.on('unhandledRejection', exitHandler.bind(null, { exit: true }));
};

if (OS.platform() === 'win32') {
  const portCount = output.getPortCount();
  const ports = [];
  for (let i = 0; i < portCount; i += 1) {
    ports.push({
      value: i,
      name: output.getPortName(i),
    });
  }
  inquirer
    .prompt([
      {
        name: 'input',
        type: 'list',
        message: 'Please choose your midi output device.',
        choices: ports,
      },
    ])
    .then(({ input }) => {
      output.openPort(input);
      main();
    });
} else {
  output.openVirtualPort('input2midi');
  main();
}
