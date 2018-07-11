const sr = require('screenres');
const { send } = require('@lib/message');
const { applyModifiers } = require('@lib/modifier');
const keyConvert = require('@lib/keyConvert');

const activators = {};

const analyse = payload => {
  if (
    payload.activator !== undefined &&
    activators[payload.activator] === undefined
  ) {
    activators[payload.activator] = false;
  }
};

const check = (payload, event) => {
  if (
    payload.activator &&
    activators[payload.activator] !== undefined &&
    keyConvert[event.keycode] === payload.activator
  ) {
    activators[payload.activator] = event.type === 'keydown';
    return true;
  }
  return false;
};

const buildValue = (payload, event) => {
  switch (payload.type) {
    case 'hold':
    case 'delay':
      return applyModifiers(payload.value, payload);

    default:
      return 0;
  }
};

const init = (payload, output, hook) => {
  analyse(payload);
  switch (payload.type) {
    case 'hold':
      hook.on('keydown', event => {
        if (check(payload, event)) {
          const value = buildValue(payload, event);
          send({ ...payload, value }, output);
        }
      });
      hook.on('keyup', event => {
        if (check(payload, event)) {
          const value = buildValue(payload, event);
          send(
            { ...payload, value, messageType: payload.upMessageType },
            output,
          );
        }
      });
      break;
    case 'delay':
      hook.on('keydown', event => {
        if (check(payload, event)) {
          const value = buildValue(payload, event);
          send({ ...payload, value }, output);
          const delay = setTimeout(() => {
            send(
              { ...payload, value, messageType: payload.upMessageType },
              output,
            );
            clearTimeout(delay);
          }, payload.delay);
        }
      });
      break;

    default:
      break;
  }
};

module.exports = init;
