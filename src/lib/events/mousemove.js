const sr = require('screenres');
const { send } = require('@lib/message');
const { applyModifiers } = require('@lib/modifier');
const keyConvert = require('@lib/keyConvert');
const math = require('@lib/math');

const screenRaw = sr.get();
const screen = { x: screenRaw[0], y: screenRaw[1] };

const activatorOptions = {
  __init: false,
  enabled: false,
};
const activators = {};

const analyse = payload => {
  if (
    payload.activator !== undefined &&
    activators[payload.activator] === undefined
  ) {
    activatorOptions.enabled = true;
    activators[payload.activator] = false;
  }
};

// limit mousemove events
let lastMessage;
const interval = 50;

const check = payload => {
  if (lastMessage && Date.now() - lastMessage < interval) return false;
  if (activatorOptions.enabled && activators[payload.activator] !== undefined) {
    return activators[payload.activator];
  }
  return true;
};

const buildValue = (payload, event) => {
  switch (payload.type) {
    case 'axis':
      return applyModifiers(
        math.lerp(
          payload.range[0],
          payload.range[1],
          event[payload.key] / screen[payload.key],
        ),
        payload,
      );

    default:
      return 0;
  }
};

const init = (payload, output, hook) => {
  analyse(payload);

  hook.on('mousemove', event => {
    if (check(payload, event)) {
      lastMessage = Date.now();
      const value = buildValue(payload, event);
      send({ ...payload, value }, output);
    }
  });

  if (!activatorOptions.__init && activatorOptions.enabled) {
    activatorOptions.__init = true;
    hook.on('keydown', event => {
      Object.keys(activators).forEach(key => {
        if (keyConvert[event.keycode] === key) {
          activators[key] = true;
        }
      });
    });
    hook.on('keyup', event => {
      Object.keys(activators).forEach(key => {
        if (keyConvert[event.keycode] === key) activators[key] = false;
      });
    });
  }
};

module.exports = init;
