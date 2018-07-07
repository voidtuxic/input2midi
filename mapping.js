const mousemove = require('@events/mousemove');
const press = require('@events/press');

const analyse = binding => {
  if (binding.messageType === undefined)
    return { ...binding, messageType: 'noteOn' };
  return binding;
};

module.exports = {
  load: (out, hook, config) => {
    Object.keys(config).forEach(key => {
      switch (key) {
        case 'mousemove':
          Object.keys(config[key]).forEach(bindName => {
            const binding = analyse(config[key][bindName]);
            mousemove({ ...binding, key: bindName }, out, hook);
          });
          break;
        case 'press':
          Object.keys(config[key]).forEach(activator => {
            const binding = analyse(config[key][activator]);
            if (binding.upMessageType === undefined)
              binding.upMessageType = 'noteOff';
            press({ ...binding, activator }, out, hook);
          });
          break;

        default:
          break;
      }
    });
  },
};
