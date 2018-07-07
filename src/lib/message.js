const { chain } = require('@lib/async');

const send = (payload, output) => {
  switch (payload.messageType) {
    case 'noteOn':
      sendNoteOn(payload, output);
    case 'noteOff':
      sendNoteOff(payload, output);
      break;
    case 'raw':
      sendRaw(payload, output);
      break;
    default:
      break;
  }
};

const sendNoteOn = ({ channel = 0, note, value } = {}, output) => {
  output.sendMessage([144 + channel, note, value]);
};
const sendNoteOff = ({ channel = 0, note, value } = {}, output) => {
  output.sendMessage([128 + channel, note, value]);
};
const sendRaw = ({ command, value } = {}, output) => {
  output.sendMessage([...command, value]);
};

module.exports = {
  send,
};
