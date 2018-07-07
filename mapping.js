const sr = require('screenres');

const math = require('./math');
const keyConvert = require('./keyConvert');

const screenRaw = sr.get();
const screen = { x: screenRaw[0], y: screenRaw[1] };

let output;
let ioHook;

const mapping = {
  mousemove: bindings => {
    const activators = {};
    Object.keys(bindings).forEach(key => {
      const binding = bindings[key];
      if (binding.activator) {
        activators[binding.activator] = false;
      }
    });
    ioHook.on('mousemove', event => {
      Object.keys(bindings).forEach(key => {
        const binding = bindings[key];
        const canAct = binding.activator ? activators[binding.activator] : true;
        if (canAct && binding.type === 'axis') {
          const value = math.lerp(
            binding.range[0],
            binding.range[1],
            event[key] / screen[key],
          );
          output.sendMessage([144, binding.note, value]);
        }
      });
    });
    if (Object.keys(activators) > 0) {
      ioHook.on('keydown', event => {
        Object.keys(activators).forEach(key => {
          if (keyConvert[event.keycode] === key) {
            activators[key] = true;
          }
        });
      });
      ioHook.on('keyup', event => {
        Object.keys(activators).forEach(key => {
          if (keyConvert[event.keycode] === key) activators[key] = false;
        });
      });
    }
  },
  keydown: bindings => {
    ioHook.on('keydown', event => {
      const key = keyConvert[event.keycode];
      if (bindings[key]) {
        const binding = bindings[key];
        switch (binding.type) {
          case 'press':
            console.log(key, binding.value);
            output.sendMessage([144, binding.note, binding.value]);
            break;

          default:
            break;
        }
      }
    });
  },
};

module.exports = {
  load: (out, hook, config) => {
    output = out;
    ioHook = hook;
    Object.keys(config).forEach(key => {
      if (mapping[key]) {
        mapping[key](config[key]);
      }
    });
  },
};
