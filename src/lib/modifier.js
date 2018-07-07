const passthrough = value => value;

const applyModifiers = (value, payload) => {
  if (
    payload.modifiers === undefined ||
    !(payload.modifiers instanceof Array) ||
    payload.modifiers.length === 0
  )
    return passthrough(value);

  // TODO: other modifiers
  return passthrough(value);
};

module.exports = { applyModifiers };
