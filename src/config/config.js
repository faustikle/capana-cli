const localConfig = require('./local-config');

exports.get = () => {
  return localConfig.get();
}