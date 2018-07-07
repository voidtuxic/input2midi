const chain = (array, method) => {
  let promise = Promise.resolve();
  array.forEach(element => {
    promise = promise.then(() => method(element));
  });
  return promise;
};

module.exports = { chain };
