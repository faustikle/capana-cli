const postgres = require('../interface/postgres');

exports.execute = (configs, script, options) => {
  postgres.run(configs, 'select * from teste', options.servico, options.ambiente);
}
