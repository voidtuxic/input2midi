const sr = require('screenres');

const math = require('./math');
const keyConvert = require('./keyConvert.macos');

const screenRaw = sr.get();
const screen = { x: screenRaw[0], y: screenRaw[1] };

let output;
let ioHook;

const mapping = {
  mousemove: bindings => {
    ioHook.on('mousemove', event => {
      Object.keys(bindings).forEach(key => {
        const binding = bindings[key];
        if (binding.type === 'axis') {
          const value = math.lerp(
            binding.range[0],
            binding.range[1],
            event[key] / screen[key],
          );
          output.sendMessage([144, binding.note, value]);
        }
      });
    });
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
